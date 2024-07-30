module.exports = {
    name: "interactionCreate",
    async execute(
        interaction: {
            isChatInputCommand?: any;
            reply?: any;
            commandName?: any;
        },
        client: { commands: any }
    ) {
        if (interaction.isChatInputCommand()) {
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);

            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: `Y'a un soucis avec cette commande !`,
                    ephemeral: true,
                });
            }
        }
    },
};
