import { Command } from "../../types/types";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import weapons from "./weapons.json";

const agentCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("weapons")
        .setDescription("Choisit une arme aléatoire de Valorant"),
    async execute(interaction: CommandInteraction) {
        const randomWeapon =
            weapons[Math.floor(Math.random() * weapons.length)];

        await interaction.reply({
            content: `Vous jouerez avec : **${randomWeapon.name}** !`,
            files: [randomWeapon.image],
        });
    },
};

export default agentCommand;
