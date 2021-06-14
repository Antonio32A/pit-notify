import { InteractionResponseType } from "discord-api-types/v8";

export const respond = content => new Response(
    JSON.stringify({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content,
            allowed_mentions: { parse: [] }
        }
    }),
    { headers: { "content-type": "application/json" } }
);

export const getKV = async key => JSON.parse(await kv.get(key));
export const updateKV = async (key, value) => await kv.put(key, JSON.stringify(value));

export const ensureUser = (id, users) => {
    if (!users[id])
        users[id] = {
            webhook: null,
            subscriptions: [],
            limit: 10
        };
    return users;
};

export const fetchUUID = async username => {
    if (!username) return null;
    const body = await fetch("https://api.mojang.com/users/profiles/minecraft/" + username);
    const json = await body.json();
    return json.id;
};

export const fetchUsername = async uuid => {
    const body = await fetch(`https://api.mojang.com/user/profiles/${uuid}/names`);
    const json = await body.json();
    return json[json.length - 1].name;
};