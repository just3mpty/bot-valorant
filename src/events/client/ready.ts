import { ActivityType } from "discord.js";

module.exports = {
    name: "ready",
    once: true,
    async execute(client: {
        user: {
            setPresence: (arg0: {
                activities: { type: any; name: string }[];
                status: string;
            }) => void;
            tag: any;
        };
    }) {
        client.user.setPresence({
            activities: [
                {
                    type: ActivityType.Playing,
                    name: "Valorant",
                },
            ],
            status: "Online",
        });
        console.log(`${client.user.tag} est connecté`);
    },
};
