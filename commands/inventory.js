const { SlashCommandBuilder } = require("discord.js");
const profileModel = require("../models/profileSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("Shows the inventory of a user"),
  async execute(interaction, profileData) {
    // Obtener el perfil del usuario desde la base de datos
    let userProfile;
    try {
      userProfile = await profileModel.findOne({ userID: interaction.user.id });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      await interaction.reply(
        "An error occurred while fetching your profile. Please try again later."
      );
      return;
    }

    // Verificar si se encontró el perfil del usuario
    if (!userProfile) {
      await interaction.reply("Your profile could not be found.");
      return;
    }

    const { specialPoints, money, inventory } = userProfile;

    // Construir un mensaje embed con la información del inventario
    const inventoryEmbed = {
      color: 0x0099ff,
      title: `${interaction.member.displayName}'s Inventory`,
      description: "Here is your current inventory:",
      thumbnail: {
        url: "https://cdn.discordapp.com/attachments/1236007039873056818/1236023842636562452/latest.png?ex=66368068&is=66352ee8&hm=d4c578c23adb3a3c5356575b4da84a0177874c30b4ed6b4b3f6d4d2987843fc7&",
      },
      fields: [
        {
          name: "Special Points",
          value: `:sparkles: ${specialPoints} special points`,
          inline: true,
        },
        {
          name: "Money",
          value: `:money_with_wings: ${money} coins`,
          inline: true,
        },
        {
          name: "\u200B",
          value: "\u200B",
          inline: false,
        },
      ],
      // Agregar una imagen al pie de página
      image: {
        url: "https://cdn.discordapp.com/attachments/1236007039873056818/1236023402389573734/ilustracion-estilo-dibujos-animados-paisaje-chino-puente-linternas_575980-1588.png?ex=66367fff&is=66352e7f&hm=ab8b21afa8f76a631e76705be9828efb3b334774d117436bc4ae17644daa558f&",
      },
    };

    // Si el usuario no tiene un inventario aún, se añade un mensaje informativo
    if (!userProfile.inventory || userProfile.inventory.length === 0) {
      inventoryEmbed.description = "Your inventory is currently empty.";
    } else {
      // Construir el campo del embed para mostrar los elementos del inventario
      const inventoryItems = userProfile.inventory
        .map((item) => `${item.quantity}x ${item.item}`)
        .join("\n");
      inventoryEmbed.fields.push({
        name: "Inventory",
        value: inventoryItems,
        inline: false,
      });
    }

    await interaction.reply({ embeds: [inventoryEmbed] });
  },
};
