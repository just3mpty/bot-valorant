import { config } from "dotenv";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import fs from "fs";
import path from "path";
import { Command } from "./types/types";

config();
const { DISCORD_TOKEN } = process.env;

interface ExtendedClient extends Client {
    commands: Collection<string, Command>;
    commandArray: Array<any>;
    handleCommands: () => void;
    handleEvents: () => void;
}

const client: ExtendedClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
}) as ExtendedClient;

client.commands = new Collection();
client.commandArray = [];

const functionFolder = fs.readdirSync(path.resolve(__dirname, "functions"));
for (const folder of functionFolder) {
    const functionFiles = fs
        .readdirSync(path.resolve(__dirname, `functions/${folder}`))
        .filter((file: string) => file.endsWith(".ts"));
    for (const file of functionFiles) {
        require(path.resolve(__dirname, `functions/${folder}/${file}`))(client);
    }
}

client.handleCommands();
client.handleEvents();

// Connecter le bot à Discord
client.login(DISCORD_TOKEN);
