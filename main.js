const {
  Client,
  Events,
  GatewayIntentBits,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
} = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent],
});

const gamedig = require("gamedig");
const axios = require("axios");

const serverAddress = "ipadress";
const serverPort = 27015;

let globalCountry;
let serverName;
let mapName;
let playerCountShow;
let playerCount;
let maxPlayers;
let percentage;

axios
  .get(`http://ipinfo.io/${serverAddress}`)
  .then((response) => {
    const country = response.data.country;
    globalCountry = country;
  })
  .catch((error) => {
    console.error("Error fetching country information:", error);
  });

client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  setInterval(async () => {
    try {
      let gameStatusChannel = client.channels.cache.get("1120136988570419230");
      let messageToEdit = await gameStatusChannel.messages.fetch(
        "1132802031623610489"
      );

      gamedig
        .query({
          type: "garrysmod", // game
          host: serverAddress,
          port: serverPort,
        })
        .then(async (state) => {
          serverName = state.name;
          mapName = state.map;
          playerCountShow = `${state.players.length}/${state.maxplayers}`;
          playerCount = state.players.length;
          maxPlayers = state.maxplayers;
          percentage = (playerCount / maxPlayers) * 100;
          const embed = new EmbedBuilder()
            .setTitle(serverName)
            .addFields(
              { name: "Status", value: ":green_circle: Online", inline: true },
              {
                name: "Address:Port",
                value: `${serverAddress}:${serverPort}`,
                inline: true,
              },
              { name: "Country", value: globalCountry, inline: true },
              { name: "Game", value: "Garry's Mod (2004)", inline: true },
              { name: "Current Map", value: mapName, inline: true },
              {
                name: "Players",
                value: `${playerCountShow} (${percentage}%)`,
                inline: true,
              }
            )
            .setFooter({ text: "made with ♥" });
          const button = new ButtonBuilder()
            .setStyle("5") // You can use 'PRIMARY', 'SECONDARY', 'SUCCESS', 'DANGER', or 'LINK'
            .setLabel("Bağlan")
            .setURL("https://url.com/"); // Replace with the URL you want the button to open

          const actionRow = new ActionRowBuilder().addComponents(button);
          await messageToEdit.edit({
            content: "\u200B",
            embeds: [embed],
            components: [actionRow],
          });
          console.log("Message edited successfully.");
        })
        .catch(async (error) => {
          const embed = new EmbedBuilder()
            .setTitle(serverName)
            .addFields(
              { name: "Status", value: ":green_red: Offline", inline: true },
              {
                name: "Address:Port",
                value: `${serverAddress}:${serverPort}`,
                inline: true,
              },
              { name: "Country", value: globalCountry, inline: true },
              { name: "Game", value: "Garry's Mod (2004)", inline: true },
              { name: "Current Map", value: mapName, inline: true },
              {
                name: "Players",
                value: `${playerCountShow} (${percentage}%)`,
                inline: true,
              }
            )
            .setFooter({ text: "made with ♥" });
          const button = new ButtonBuilder()
            .setStyle("5") // You can use 'PRIMARY', 'SECONDARY', 'SUCCESS', 'DANGER', or 'LINK'
            .setLabel("Bağlan")
            .setURL("https://url.com/"); // Replace with the URL you want the button to open

          const actionRow = new ActionRowBuilder().addComponents(button);
          await messageToEdit.edit({
            content: "\u200B",
            embeds: [embed],
          });
          console.log("Message edited successfully.");
        });
    } catch (error) {
      console.error("Error editing the message:", error);
    }
  }, 30000);
});

client.login(
  "token"
);
