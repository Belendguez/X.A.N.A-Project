/*const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const profileModel = require("../models/profileSchema");
const { execute } = require("../events/ready");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("admin")
    .setDescription("Access to the admin commands")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add_sp")
        .setDescription("Add Special Points to a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to add points to")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The ammount of points to add")
            .setRequired(true)
            .setMinValue(1)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("subtract_sp")
        .setDescription("Subtract Special Points of a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The use to subtract points from")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The ammount of points to subtract")
            .setRequired(true)
            .setMinValue(1)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add_money")
        .setDescription("Add money to a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to add money to")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The ammount of money to add")
            .setRequired(true)
            .setMinValue(1)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("subtract_money")
        .setDescription("Subtract money of a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The use to subtract money from")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The ammount of money to subtract")
            .setRequired(true)
            .setMinValue(1)
        )
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const adminSubcommand = interaction.options.getSubcommand();

    if (adminSubcommand === "add_sp") {
      const user = interaction.options.getUser("user");
      const amount = interaction.options.getInteger("amount");

      await profileModel.findOneAndUpdate(
        { userID: user.id },
        {
          $inc: {
            specialPoints: amount,
          },
        }
      );
      await interaction.editReply(`You had given ${amount} special points!`);
    }
    if (adminSubcommand === "subtract_sp") {
      const user = interaction.options.getUser("user");
      const amount = interaction.options.getInteger("amount");

      await profileModel.findOneAndUpdate(
        { userID: user.id },
        {
          $inc: {
            specialPoints: -amount,
          },
        }
      );
      await interaction.editReply(`You have taken ${amount} special points!`);
    }
    if (adminSubcommand === "add_money") {
      const user = interaction.options.getUser("user");
      const amount = interaction.options.getInteger("amount");

      await profileModel.findOneAndUpdate(
        { userID: user.id },
        {
          $inc: {
            money: amount,
          },
        }
      );
      await interaction.editReply(`You had given ${amount} coins!`);
    }

    if (adminSubcommand === "subtract_money") {
      const user = interaction.options.getUser("user");
      const amount = interaction.options.getInteger("amount");

      await profileModel.findOneAndUpdate(
        { userID: user.id },
        {
          $inc: {
            money: -amount,
          },
        }
      );
      await interaction.editReply(`You have taken ${amount} coins!`);
    }
  },
};*/
const { SlashCommandBuilder } = require("discord.js");
const profileModel = require("../models/profileSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("admin")
    .setDescription("Access to the admin commands")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add_sp")
        .setDescription("Add Special Points to a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to add points to")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount of points to add")
            .setRequired(true)
            .setMinValue(1)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("subtract_sp")
        .setDescription("Subtract Special Points from a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to subtract points from")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount of points to subtract")
            .setRequired(true)
            .setMinValue(1)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add_money")
        .setDescription("Add money to a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to add money to")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount of money to add")
            .setRequired(true)
            .setMinValue(1)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("subtract_money")
        .setDescription("Subtract money from a user")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to subtract money from")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount of money to subtract")
            .setRequired(true)
            .setMinValue(1)
        )
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const adminSubcommand = interaction.options.getSubcommand();

    let resultMessage = "";

    if (adminSubcommand === "add_sp") {
      const user = interaction.options.getUser("user");
      const amount = interaction.options.getInteger("amount");

      await profileModel.findOneAndUpdate(
        { userID: user.id },
        {
          $inc: {
            specialPoints: amount,
          },
        }
      );
      resultMessage = `You have given ${amount} special points to ${
        interaction.guild.members.cache.get(user.id).nickname || user.username
      }!`;
    }

    if (adminSubcommand === "subtract_sp") {
      const user = interaction.options.getUser("user");
      const amount = interaction.options.getInteger("amount");

      await profileModel.findOneAndUpdate(
        { userID: user.id },
        {
          $inc: {
            specialPoints: -amount,
          },
        }
      );
      resultMessage = `You have taken ${amount} special points from ${
        interaction.guild.members.cache.get(user.id).nickname || user.username
      }!`;
    }

    if (adminSubcommand === "add_money") {
      const user = interaction.options.getUser("user");
      const amount = interaction.options.getInteger("amount");

      await profileModel.findOneAndUpdate(
        { userID: user.id },
        {
          $inc: {
            money: amount,
          },
        }
      );
      resultMessage = `You have given ${amount} coins to ${
        interaction.guild.members.cache.get(user.id).nickname || user.username
      }!`;
    }

    if (adminSubcommand === "subtract_money") {
      const user = interaction.options.getUser("user");
      const amount = interaction.options.getInteger("amount");

      await profileModel.findOneAndUpdate(
        { userID: user.id },
        {
          $inc: {
            money: -amount,
          },
        }
      );
      resultMessage = `You have taken ${amount} coins from ${
        interaction.guild.members.cache.get(user.id).nickname || user.username
      }!`;
    }

    // Define el objeto myEmbed
    const myEmbed = {
      color: 0x0099ff,
      title: "Admin Command Result",
      description: resultMessage,
    };

    // Responde con el embed
    await interaction.editReply({ embeds: [myEmbed] });
  },
};
