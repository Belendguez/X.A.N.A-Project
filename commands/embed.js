const { SlashCommandBuilder } = require("discord.js");
const { execute } = require("./ping");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Show an example of an embed"),
  async execute(interaction) {
    const myEmbed = {
      color: 0xfa8072,
      title: "Embed Title",
    };
    await interaction.reply({ embeds: [myEmbed] });
  },
};
