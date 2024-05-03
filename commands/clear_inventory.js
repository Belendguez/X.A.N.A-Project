const { SlashCommandBuilder } = require("discord.js");
const profileModel = require("../models/profileSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear_inventory")
    .setDescription("Clears the user's inventory"),
  async execute(interaction, profileData) {
    try {
      // Actualizar el documento del perfil en la base de datos para que el inventario sea un arreglo vacío
      await profileModel.findOneAndUpdate(
        { userID: interaction.user.id },
        { inventory: [] }
      );

      // Responder al usuario que su inventario ha sido limpiado
      await interaction.reply("Your inventory has been cleared.");
    } catch (error) {
      console.error("Error clearing inventory:", error);
      await interaction.reply(
        "An error occurred while clearing your inventory."
      );
    }
  },
};
