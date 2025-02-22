const { Client, Events, GatewayIntentBits } = require("discord.js");
require('dotenv').config(); 
const TOKEN = process.env.RESET_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("messageCreate", (message) => {
  if(message.author.bot) return;

//   if(message.content.startsWith('create')) {
//     const url = message.content.split('create')[1];
//     return message.reply({
//         content:"Generating Short ID for"+url,
//     })
//   }

  message.reply({
    content: "Hello! from BOT",
  })
});

client.on('interactionCreate',(interaction)=>{
    interaction.reply("Pong!!!");
})

client.login(TOKEN);
