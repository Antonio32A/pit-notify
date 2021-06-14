# pit-notify
Automatically send a Discord message using a webhook when a player joins Hypixel.

Not exactly Pit related, but I might add Pit notifications at some point.

## Requirements
- node 14
- Cloudflare account
- Discord Application with the bot setting enabled
- Hypixel API key

## Configuration
0. Run `npm i`.
1. Set the following secrets:
    - apiKey - your Hypixel API key
    - publicKey - your Discord application public key
2. Modify `config.json.example` and rename it to `config.json` and run `npm run setup`.
3. Run `npm run setup`.
4. Create a KV namespace and create keys `nameCache`, `playerCache`, `users` with the value `{}`.
5. Modify `wrangler.toml.example` and rename it to `wrangler.toml`.
6. Run `wrangler publish`.
7. Copy your worker url and set it as a `Interactions Endpoint URL`.
8. Invite your bot to a server with the scope `applications.commands`.

## Commands
- /subscriptions list
- /subscriptions add <username>
- /subscriptions remove <username>
- /updatename <uuid>
- /webhook <url>