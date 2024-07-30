import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/types";
import agents from "./agents.json";

const agentCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("agent")
        .setDescription("Choisit un agent aléatoire de Valorant"),
    async execute(interaction: CommandInteraction) {
        try {
            // Defer the reply to avoid potential long response times
            await interaction.deferReply();

            const randomAgent =
                agents[Math.floor(Math.random() * agents.length)];

            if (randomAgent?.name && randomAgent?.image) {
                await interaction.editReply({
                    content: `Tu devras jouer **${randomAgent.name}** !`,
                    files: [randomAgent.image],
                });
            } else {
                throw new Error(
                    "L'agent sélectionné ne contient pas les informations nécessaires."
                );
            }
        } catch (error) {
            console.error("Erreur lors de la réponse à l'interaction :", error);

            // Utiliser interaction.editReply si deferReply a été utilisé
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({
                    content: "Une erreur est survenue lors de la réponse.",
                });
            } else {
                await interaction.reply({
                    content: "Une erreur est survenue lors de la réponse.",
                    ephemeral: true,
                });
            }
        }
    },
};

export default agentCommand;
