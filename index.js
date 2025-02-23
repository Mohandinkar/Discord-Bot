const { Client, Events, GatewayIntentBits } = require("discord.js");

const { Configuration, OpenAIApi } = require("openai");
const { OpenAI } = require("openai");

require('dotenv').config(); 
const TOKEN = process.env.RESET_TOKEN;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("messageCreate", async (message) => {
  if(message.author.bot) return;

//   if(message.content.startsWith('create')) {
//     const url = message.content.split('create')[1];
//     return message.reply({
//         content:"Generating Short ID for"+url,
//     })
//   }

  const userMsg = message.content;
  console.log(userMsg);

  try {
    // Send message to OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  
      messages: [{ role: "user", content: userMsg }],
    });
    const botReply = response.data.choices[0].message.content;

    message.reply({
      content: botReply,
  })
  } catch (error) {
    console.error("Error with OpenAI:", error);
    message.reply("Sorry, I couldn't process that.");
  }

});

client.on('interactionCreate',(interaction)=>{
    interaction.reply("Pong!!!");
})

client.login(TOKEN);
