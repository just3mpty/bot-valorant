import fs from "fs";

module.exports = (client: {
    handleEvents: () => Promise<void>;
    once: (arg0: any, arg1: (...args: any[]) => any) => void;
    on: (arg0: any, arg1: (...args: any[]) => any) => void;
}) => {
    client.handleEvents = async () => {
        const eventFolders = fs.readdirSync(`./src/events`);
        for (const folder of eventFolders) {
            const eventFiles = fs
                .readdirSync(`./src/events/${folder}`)
                .filter((file: string) => file.endsWith(".ts"));

            switch (folder) {
                case "client":
                    for (const file of eventFiles) {
                        const event = require(`../../events/${folder}/${file}`);
                        if (event.once)
                            client.once(event.name, (...args: any) =>
                                event.execute(...args, client)
                            );
                        else
                            client.on(event.name, (...args: any) =>
                                event.execute(...args, client)
                            );
                    }
                    break;
                default:
                    break;
            }
        }
    };
};
