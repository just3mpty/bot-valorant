import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import fs from "fs";
import { Collection } from "discord.js";
import { Command } from "../../types/types";
import dotenv from "dotenv";

dotenv.config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID) {
    console.error("Un ou plusieurs paramètres d'environnement sont manquants.");
    process.exit(1);
}

const rest = new REST({ version: "9" }).setToken(DISCORD_TOKEN);

module.exports = (client: {
    handleCommands?: () => void;
    commandArray: Array<any>;
    commands: Collection<string, Command>;
}) => {
    client.handleCommands = async () => {
        const commandFolders = fs.readdirSync(`./src/commands`);

        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./src/commands/${folder}`)
                .filter((file: string) => file.endsWith(".ts"));

            const { commands, commandArray } = client;

            for (const file of commandFiles) {
                try {
                    const command = (
                        await import(`../../commands/${folder}/${file}`)
                    ).default;

                    if (command && command.data && command.execute) {
                        commands.set(command.data.name, command);
                        commandArray.push(command.data.toJSON());
                        console.log(
                            `Command: ${command.data.name} successfully handled! <3`
                        );
                    } else {
                        console.warn(
                            `La commande à ${folder}/${file} est manquante d'une propriété "data" ou "execute".`
                        );
                    }
                } catch (error) {
                    console.error(
                        `Erreur lors du chargement de ${folder}/${file}:`,
                        error
                    );
                }
            }
        }

        try {
            // Supprime toutes les commandes avant de les recharger
            await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID!, GUILD_ID!),
                { body: [] }
            );
            // Recharge les commandes
            await rest.put(
                Routes.applicationGuildCommands(CLIENT_ID!, GUILD_ID!),
                { body: client.commandArray }
            );
            console.log("Commandes mises à jour avec succès !");
        } catch (error) {
            console.error(
                "Erreur lors de l'enregistrement des commandes :",
                error
            );
        }
    };
};
