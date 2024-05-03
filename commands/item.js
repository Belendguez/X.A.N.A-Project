const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const profileModel = require("../models/profileSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-item")
    .setDescription("Add a new item to a user's inventory")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to add the item to")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("The name of the item")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("quantity")
        .setDescription("The quantity of the item")
        .setRequired(true)
        .setMinValue(1)
    ),
  async execute(interaction) {
    // Verificar si el usuario tiene permisos de moderador o administrador
    if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return await interaction.reply(
        "You don't have permission to use this command."
      );
    }

    // Obtener los parámetros del comando
    const targetUser = interaction.options.getUser("user");
    const item = interaction.options.getString("item");
    const quantity = interaction.options.getInteger("quantity");

    // Obtener el miembro correspondiente al usuario
    const guildMember = interaction.guild.members.cache.get(targetUser.id);
    if (!guildMember) {
      return await interaction.reply("Could not find the specified user.");
    }

    // Obtener el inventario actual del usuario
    let profileData = await profileModel.findOne({ userID: targetUser.id });
    let inventory = profileData.inventory || [];

    // Verificar si el artículo ya existe en el inventario
    const existingItemIndex = inventory.findIndex(
      (i) => i.item.toLowerCase() === item.toLowerCase()
    );

    if (existingItemIndex !== -1) {
      // Si el artículo ya existe, actualizamos su cantidad
      inventory[existingItemIndex].quantity += quantity;
    } else {
      // Si el artículo no existe, lo añadimos al inventario
      inventory.push({ item, quantity });
    }

    // Actualizamos el perfil del usuario con el nuevo inventario
    try {
      await profileModel.findOneAndUpdate(
        { userID: targetUser.id },
        { $set: { inventory } }
      );
      await interaction.reply(
        `Successfully added ${quantity} ${item}(s) to ${guildMember.displayName}'s inventory!`
      );
    } catch (error) {
      console.error("Error adding item to inventory:", error);
      await interaction.reply(
        "An error occurred while adding the item to the user's inventory."
      );
    }
  },
};
