const { SlashCommandBuilder } = require("discord.js");
const ProfileModel = require("../models/profileSchema");

const shopCatalogue = require("../shop/specialCatalogue.json");

async function getUserProfile(userID) {
  try {
    // Busca el perfil del usuario en la base de datos
    const userProfile = await ProfileModel.findOne({ userID });
    if (!userProfile) {
      // Si el perfil del usuario no existe, crea uno nuevo
      const newProfile = new ProfileModel({ userID });
      return await newProfile.save();
    }
    return userProfile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("buy_sp")
    .setDescription("Buy an item from the special shop.")
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("The item you want to buy.")
        .setRequired(true)
    ),
  async execute(interaction) {
    // Obtén el artículo que el usuario quiere comprar
    const itemName = interaction.options.getString("item");

    // Busca el artículo en el catálogo de la tienda
    const item = shopCatalogue.items.find(
      (item) => item.name.toLowerCase() === itemName.toLowerCase()
    );

    if (!item) {
      // Si el artículo no está en la tienda, notifica al usuario
      await interaction.reply("Sorry, this item is not available in the shop.");
      return;
    }

    // Verifica si el usuario tiene suficientes fondos para comprar el artículo
    const userProfile = await getUserProfile(interaction.user.id);
    if (userProfile.specialPoints < item.price) {
      // Si el usuario no tiene suficientes puntos especiales, notifica al usuario
      await interaction.reply(
        "Sorry, you don't have enough special points to buy this item."
      );
      return;
    }

    // Actualiza el inventario del usuario
    const updatedInventory = userProfile.inventory || [];
    updatedInventory.push({ item: itemName, quantity: 1 });

    // Deduce los puntos especiales del usuario
    userProfile.specialPoints -= item.price;

    // Guarda los cambios en la base de datos
    try {
      await userProfile.save();
    } catch (error) {
      console.error("Error updating user profile:", error);
      await interaction.reply(
        "An error occurred while processing your request. Please try again later."
      );
      return;
    }

    // Confirma la compra al usuario
    await interaction.reply(`You have successfully bought ${itemName}.`);
  },
};
