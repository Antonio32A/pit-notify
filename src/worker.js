import { getKV, updateKV } from "./utils";

export const handleCronTrigger = async () => {
    const users = Object.values(await getKV("users"));
    const playerCache = await getKV("playerCache");
    const nameCache = await getKV("nameCache");
    const toFetch = [...new Set([].concat.apply([], users.map(u => u.subscriptions)))];
    const fetchedPlayers = await Promise.all(toFetch.map(fetchStatus));

    for (let user of users) {
        if (!user.webhook) continue;
        const embeds = [];

        user.subscriptions.forEach(sub => {
            if (playerCache[sub] !== fetchedPlayers.find(i => i.uuid === sub).online)
                embeds.push(sub);
        });

        if (embeds.length !== 0)
            await fetch(user.webhook, {
                method: "POST",
                body: JSON.stringify({
                    embeds: embeds.map(uuid => {
                        const { online } = fetchedPlayers.find(i => i.uuid === uuid);
                        let message = `${nameCache[uuid]} ${online ? "joined" : "left"}.`;
                        if (online === "ERROR")
                            message = `Failed to fetch ${nameCache[uuid]}'s data.`;

                        return {
                            author: {
                                name: message,
                                url: "https://namemc.com/profile/" + uuid,
                                icon_url: "https://crafthead.net/avatar/" + uuid
                            },
                            color: online ? 65406 : 16663109
                        };
                    })
                }),
                headers: {
                    "Content-Type": "application/json",
                    "User-Agent": "pit-notify"
                }
            });
    }

    fetchedPlayers.forEach(data => playerCache[data.uuid] = data.online);
    await updateKV("playerCache", playerCache);
};

const fetchStatus = async uuid => {
    try {
        const body = await fetch(`https://api.hypixel.net/status?key=${apiKey}&uuid=${uuid}`);
        const json = await body.json();
        return { uuid, online: json.session.online };
    } catch {
        return { uuid, online: "ERROR" };
        return { uuid, online: "ERROR" };
    }
};