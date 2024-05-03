const {
  SlashCommandBuilder,
  ButtonInteraction,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const moneyCatalogue = require("../shop/moneyCatalogue.json");

// Función para dividir el catálogo en páginas
function paginateCatalogue(items, pageSize) {
  const pages = [];
  for (let i = 0; i < items.length; i += pageSize) {
    pages.push(items.slice(i, i + pageSize));
  }
  return pages;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("money_shop")
    .setDescription("Shows the money shop."),
  async execute(interaction) {
    const pageSize = 5; // Número de elementos por página
    const cataloguePages = paginateCatalogue(moneyCatalogue.items, pageSize);

    // Inicializar el índice de la página
    let currentPage = 0;

    // Función para actualizar el mensaje con la página actual del catálogo
    async function updateMessage() {
      const currentPageItems = cataloguePages[currentPage];
      const pageEmbed = {
        color: 0x0099ff,
        title: "Money Shop",
        description: `Welcome to the Money Shop! Here you can find the items you can buy with your coins!\n\nPage ${
          currentPage + 1
        } of ${cataloguePages.length}`,
        thumbnail: {
          url: "https://cdn.discordapp.com/attachments/1236007039873056818/1236041623184343080/dc0q0gt-33efa367-9b20-40a4-82ae-5ac993343328.png?ex=663690f7&is=66353f77&hm=20e72534cdd65e2d2131a74bc3eb6413bb8a6e9dd3c560e22588eb2081da454c&",
        },
        fields: [],
        image: {
          url: "https://cdn.discordapp.com/attachments/1236007039873056818/1236041514333900830/ilustracion-estilo-dibujos-animados-casa-japonesa-paisaje-montana_771703-14476.png?ex=663690dd&is=66353f5d&hm=53f181fb069e3b6fe0a7a4786c09b8e1d1e647e7b75174c89a2b4dc5fca8e84e&",
        },
      };

      currentPageItems.forEach((item) => {
        pageEmbed.fields.push({
          name: item.name,
          value: `${item.description}\nPrice: ${item.price} coins`,
          inline: false,
        });
      });

      // Crear botones de paginación
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("previous_page")
          .setLabel("Previous")
          .setStyle("Primary")
          .setDisabled(currentPage === 0),
        new ButtonBuilder()
          .setCustomId("next_page")
          .setLabel("Next")
          .setStyle("Primary")
          .setDisabled(currentPage === cataloguePages.length - 1)
      );

      // Responder o editar el mensaje con el embed y los botones de paginación
      if (!interaction.replied) {
        await interaction.reply({ embeds: [pageEmbed], components: [row] });
      } else {
        await interaction.editReply({ embeds: [pageEmbed], components: [row] });
      }
    }

    // Llamar a la función para actualizar el mensaje inicial
    await updateMessage();

    // Crear un colector de interacciones para manejar los botones de paginación
    const collector = interaction.channel.createMessageComponentCollector({
      time: 60000,
    });

    // Manejar las interacciones de los botones
    collector.on("collect", async (interaction) => {
      // Si el botón es para ir a la página anterior
      if (interaction.customId === "previous_page") {
        currentPage--;
      }
      // Si el botón es para ir a la página siguiente
      else if (interaction.customId === "next_page") {
        currentPage++;
      }

      // Actualizar el mensaje con la página actual
      await updateMessage();

      // Actualizar la interacción para eliminar la notificación de que se ha recibido la interacción
      await interaction.deferUpdate();
    });

    // Manejar el evento de finalización del colector de interacciones
    collector.on("end", () => {
      // Eliminar los botones de paginación al finalizar el tiempo de espera
      interaction.editReply({ components: [] });
    });
  },
};
