/*const { SlashCommandBuilder } = require("discord.js");
const { execute } = require("../events/ready");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    console.log(interaction);
    await interaction.reply("pong");
  },
};*/

const { SlashCommandBuilder } = require("discord.js");
const { execute } = require("../events/ready");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    const myEmbed = {
      color: 0xfa8072,
      title: "Pong",
    };
    await interaction.reply({ embeds: [myEmbed] });
  },
};
