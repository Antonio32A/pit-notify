import { InteractionResponseType, InteractionType } from "discord-api-types/v8";
import { verifyKey } from "discord-interactions";
import { ensureUser, fetchUsername, fetchUUID, getKV, respond, updateKV } from "./utils";

export const handleRequest = async request => {
    const signature = request.headers.get("X-Signature-Ed25519");
    const timestamp = request.headers.get("X-Signature-Timestamp");
    if (!signature || !timestamp) return Response.redirect("https://antonio32a.com");
    if (!verifyKey(await request.clone().arrayBuffer(), signature, timestamp, publicKey))
        return new Response("", { status: 401 });

    const interaction = await request.json();
    if (interaction.type === InteractionType.Ping)
        return new Response(
            JSON.stringify({ type: InteractionResponseType.Pong }),
            { headers: { "content-type": "application/json" } }
        );

    if (interaction.type === InteractionType.ApplicationCommand) {
        const id = interaction.member.user.id;
        const users = ensureUser(id, await getKV("users"));
        const nameCache = await getKV("nameCache");
        const subscriptions = users[id].subscriptions;
        const limit = users[id].limit;
        const subscriptionCount = subscriptions.length + "/" + limit;

        switch (interaction.data.name) {
            case "updateusername":
                const targetUUID = interaction.data.options.find(i => i.name === "uuid").value;
                try {
                    const newUsername = await fetchUsername(targetUUID);
                    nameCache[targetUUID] = newUsername;
                    return respond(`:ok_hand: Successfully updated the username to ${newUsername}.`);
                } catch {
                    return respond(":x: Failed to update username.");
                }
            case "webhook":
                const url = interaction.data.options.find(i => i.name === "url").value;
                users[id].webhook = url;
                await updateKV("users", users);
                return respond(":ok_hand: Successfully set your webhook URL.");
            case "subscriptions":
                const action = interaction.data.options[0].name;
                const username = interaction.data.options[0].options?.[0]?.value;

                if (!/^\w{1,16}$/.test(username))
                    return respond(":x: Invalid username.");

                const uuid = await fetchUUID(username);
                if (uuid) {
                    nameCache[uuid] = username;
                    await updateKV("nameCache", nameCache);
                }

                switch (action) {
                    case "list":
                        if (subscriptions.length === 0)
                            return respond(
                                `:x: You are currently not subscribed to anyone. (${subscriptionCount})`
                            );

                        return respond(
                            ":ok_hand: You are currently subscribed to " +
                            subscriptionCount + " players:\n"
                            + subscriptions.map(i => nameCache[i]).join("\n")
                        );
                    case "add":
                        if (subscriptions.includes(uuid))
                            return respond(`:x: ${username} is already in the list.`);
                        if (subscriptions.length >= limit)
                            return respond(`:x: You cannot subscribe to more than ${limit} players. Sorry!`);

                        users[id].subscriptions.push(uuid);
                        await updateKV("users", users);
                        return respond(`:ok_hand: Successfully added ${username} to the list.`);
                    case "remove":
                        if (!subscriptions.includes(uuid))
                            return respond(`:x: ${username} isn't in the list.`);

                        users[id].subscriptions = subscriptions.filter(i => i !== uuid);
                        await updateKV("users", users);
                        return respond(`:ok_hand: Successfully removed ${username} from the list.`);
                }
        }
    }
};
