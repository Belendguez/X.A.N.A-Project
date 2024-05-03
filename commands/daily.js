/*const { SlashCommandBuilder } = require("discord.js");
const { execute } = require("../events/ready");

const parseMilliseconds = require("parse-ms-2");
const profileModel = require("../models/profileSchema");
const { daily } = require("../globalValues.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Redeem free SP every day!!"),
  async execute(interaction, profileData) {
    const { id } = interaction.user;
    const { dailyLastUsed } = profileData;

    const cooldown = 86400000;
    const timeLeft = cooldown - (Date.now() - dailyLastUsed);

    if (timeLeft > 0) {
      await interaction.deferReply({ ephemeral: true });
      const { hours, minutes, seconds } = parseMilliseconds(timeLeft);
      await interaction.editReply(
        `Claim your next daily in ${hours} hrs, ${minutes} min, ${seconds} sec`
      );
    }
    await interaction.deferReply();

    try {
      await profileModel.findOneAndUpdate(
        { userID: id },
        {
          $set: {
            dailyLastUsed: Date.now(),
          },
          $inc: {
            specialPoints: daily,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
    await interaction.editReply(`You redeemed ${daily} special points!`);
  },
};*/

const { SlashCommandBuilder } = require("discord.js");
const { execute } = require("../events/ready");

const parseMilliseconds = require("parse-ms-2");
const profileModel = require("../models/profileSchema");
const { daily } = require("../globalValues.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Redeem free SP every day!!"),
  async execute(interaction, profileData) {
    const { id } = interaction.user;
    const { dailyLastUsed } = profileData;

    const cooldown = 86400000;
    const timeLeft = cooldown - (Date.now() - dailyLastUsed);

    // Define el objeto myEmbed
    const myEmbed = {
      color: 0x0099ff,
      title: "Daily Reward",
    };

    if (timeLeft > 0) {
      await interaction.deferReply({ ephemeral: true });
      const { hours, minutes, seconds } = parseMilliseconds(timeLeft);
      // Actualiza el objeto myEmbed con el mensaje de tiempo restante
      myEmbed.description = `Claim your next daily in ${hours} hrs, ${minutes} min, ${seconds} sec`;
      // Responde con el embed actualizado
      await interaction.editReply({ embeds: [myEmbed] });
      return;
    }

    await interaction.deferReply();

    try {
      await profileModel.findOneAndUpdate(
        { userID: id },
        {
          $set: {
            dailyLastUsed: Date.now(),
          },
          $inc: {
            specialPoints: daily,
          },
        }
      );
    } catch (err) {
      console.log(err);
    }

    // Actualiza el objeto myEmbed con el mensaje de redención exitosa
    myEmbed.description = `You redeemed ${daily} special points!`;
    // Responde con el embed actualizado
    await interaction.editReply({ embeds: [myEmbed] });
  },
};
