import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../../types/types";
import weapons from "./weapons.json";

const weaponCommand: Command = {
    data: new SlashCommandBuilder()
        .setName("weapon")
        .setDescription("Choisit une arme aléatoire de Valorant"),
    async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) {
            return;
        }

        try {
            await interaction.deferReply();

            const randomWeapon =
                weapons[Math.floor(Math.random() * weapons.length)];

            if (randomWeapon?.name && randomWeapon?.image) {
                await interaction.editReply({
                    content: `Tu devras jouer **${randomWeapon.name}** à la prochaine manche !`,
                    files: [randomWeapon.image],
                });
            } else {
                throw new Error(
                    "L'arme sélectionnée ne contient pas les informations nécessaires."
                );
            }
        } catch (error) {
            if (interaction.deferred || interaction.replied) {
                try {
                    await interaction.editReply({
                        content: "Une erreur est survenue lors de la réponse.",
                    });
                } catch (editError) {
                    console.error(
                        "Erreur lors de l'édition de la réponse :",
                        editError
                    );
                }
            } else {
                try {
                    await interaction.reply({
                        content: "Une erreur est survenue lors de la réponse.",
                        ephemeral: true,
                    });
                } catch (replyError) {
                    console.error(
                        "Erreur lors de la réponse à l'interaction :",
                        replyError
                    );
                }
            }
        }
    },
};

export default weaponCommand;
