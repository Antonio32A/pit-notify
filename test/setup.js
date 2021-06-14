// just a quick setup script which could be optimized
const config = require("../config.json");
const fetch = require("node-fetch");
const { ApplicationCommandOptionType } = require("discord-api-types/v8");

fetch(`https://discord.com/api/v8/applications/${config.applicationId}/commands`, {
    method: "POST",
    headers: {
        Authorization: `Bot ${config.token}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        name: "webhook",
        description: "Sets the pit-notify webhook.",
        options: [{
            type: ApplicationCommandOptionType.STRING,
            name: "url",
            description: "URL of the pit-notify webhook.",
            required: true
        }]
    })
}).then(res => res.json()).then(output => console.log(output));

fetch(`https://discord.com/api/v8/applications/${config.applicationId}/commands`, {
    method: "POST",
    headers: {
        Authorization: `Bot ${config.token}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        name: "updateusername",
        description: "Fetches and updates player's username.",
        options: [{
            type: ApplicationCommandOptionType.STRING,
            name: "uuid",
            description: "UUID of the player you're looking to update.",
            required: true
        }]
    })
}).then(res => res.json()).then(output => console.log(output));

fetch(`https://discord.com/api/v8/applications/${config.applicationId}/commands`, {
    method: "POST",
    headers: {
        Authorization: `Bot ${config.token}`,
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        name: "subscriptions",
        description: "Add, remove or list your pit-notify player subscriptions.",
        options: [
            {
                type: ApplicationCommandOptionType.SUB_COMMAND,
                name: "add",
                description: "Add a player to your pit-notify subscriptions.",
                options: [{
                    type: ApplicationCommandOptionType.STRING,
                    name: "username",
                    description: "Username of the player you wish to add.",
                    required: true
                }]
            },
            {
                type: ApplicationCommandOptionType.SUB_COMMAND,
                name: "remove",
                description: "Remove a player from your pit-notify subscriptions.",
                options: [{
                    type: ApplicationCommandOptionType.STRING,
                    name: "username",
                    description: "Username of the player you wish remove.",
                    required: true
                }]
            },
            {
                type: ApplicationCommandOptionType.SUB_COMMAND,
                name: "list",
                description: "List your pit-notify subscriptions."
            }
        ]
    })
}).then(res => res.json()).then(output => console.log(JSON.stringify(output, null, 4)));