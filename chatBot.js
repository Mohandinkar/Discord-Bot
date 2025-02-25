require("dotenv").config();

const API_KEY = process.env.GEMINI_API_KEY;
const { Client, Events, GatewayIntentBits } = require("discord.js");
const TOKEN = process.env.RESET_TOKEN;

//gemini config
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//discord.js
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

//starting msg
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  message.reply({
    content:
      "Hello! I'm ready to chat. Ask me anything!, please use the `/chat` command followed by your message.",
  });
});

//msg with the '/ping' and '/chat' command
client.on("interactionCreate", async (interaction) => {
  //   if(message.author.bot) return;
  if (!interaction.isCommand()) return; //checks whether the received interaction is a slash command.
  if (interaction.commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (interaction.commandName === "chat") {
    await interaction.deferReply(); // buying some time to think the bot (API call/response) before replying to the user "bot is thinking..."

    const userMsg = interaction.options.getString("user");
    console.log(userMsg);
    try {
      const result = await model.generateContent(userMsg);
      console.log(result.response.text());
      const botReply = result.response.text();

      // Split the response if it's too long
      if (botReply.length > 2000) {
        const chunks = splitMessage(botReply, 2000);
        await interaction.editReply(chunks[0]); // Edit the deferred reply("bot is thinking...")
        for (let i = 1; i < chunks.length; i++) {
          await interaction.followUp(chunks[i]);
        }
      } else {
        await interaction.editReply(botReply);
      }

    } catch (err) {
      console.log("Not responding properly!", err);
      await interaction.editReply("Sorry, I couldn't process that.");
    }
  }
 
});

client.login(TOKEN);

// Function to split a message into chunks

function splitMessage(message, maxLength) {
  const parts = [];
  while (message.length > maxLength) {
    let part = message.substring(0, maxLength);
    let breakIndex = part.lastIndexOf("\n"); //Try to break at newlines.
    if (breakIndex === -1) {
      breakIndex = maxLength; //if no newline, break at max length.
    }
    parts.push(message.substring(0, breakIndex));
    message = message.substring(breakIndex); //string from breakIndex will store in the message to check loop condition
  }
  parts.push(message); // Add the remaining part
  return parts;
}
