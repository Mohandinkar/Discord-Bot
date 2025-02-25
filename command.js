//command registration 

const { REST, Routes } = require("discord.js");
require("dotenv").config();
const TOKEN = process.env.RESET_TOKEN;
const CLIENT = process.env.CLIENT_ID;

const commands = [
  {
    name: "ping",
    description: "Replies with Pong!",
  },
  {
    name: "chat",
    description: "Chat with the bot!",
    options: [
      {
        name: "user",
        type: 3, //msg is a type of string
        description: "Msg will be send to BOT!",
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(CLIENT), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
