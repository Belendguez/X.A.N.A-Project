const { SlashCommandBuilder, MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Shows a user their balance!"),
  async execute(interaction, profileData) {
    const { specialPoints, money } = profileData;
    const nickname = interaction.member.displayName;

    // Define el objeto myEmbed
    const myEmbed = {
      color: 0x0099ff,
      title: `${nickname}'s Balance`,
      fields: [
        {
          name: "Special Points",
          value: `:sparkles: ${specialPoints}`,
          inline: true,
        },
        {
          name: "Money",
          value: `:money_with_wings: ${money}`,
          inline: true,
        },
      ],
    };

    // Responde con el embed
    await interaction.reply({ embeds: [myEmbed] });
  },
};
