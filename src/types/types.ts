import {
    CommandInteraction,
    SlashCommandBuilder,
    Client,
    Collection,
} from "discord.js";

export type Command = {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction) => Promise<void>;
};

export interface CustomClient extends Client {
    commands: Collection<string, Command>;
    commandArray: any[];
}
