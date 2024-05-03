const {
  SlashCommandBuilder,
  ButtonInteraction,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const specialCatalogue = require("../shop/specialCatalogue.json");

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
    .setName("special_shop")
    .setDescription("Shows the special shop."),
  async execute(interaction) {
    const pageSize = 5; // Número de elementos por página
    const cataloguePages = paginateCatalogue(specialCatalogue.items, pageSize);

    // Inicializar el índice de la página
    let currentPage = 0;

    // Función para actualizar el mensaje con la página actual del catálogo
    async function updateMessage() {
      const currentPageItems = cataloguePages[currentPage];
      const pageEmbed = {
        color: 0x0099ff,
        title: "Special Shop",
        description: `Welcome to the Special Shop! Here you can find the items you can buy with your Special Points!\n\nPage ${
          currentPage + 1
        } of ${cataloguePages.length}`,
        thumbnail: {
          url: "https://media.discordapp.net/attachments/1236007039873056818/1236007058663407666/latest.png?ex=663670c6&is=66351f46&hm=a1f57113dbe16099bd65dbab52c9adc7fd5e4c56a40fcba654da36081f9d9e89&=&format=webp&quality=lossless",
        },
        fields: [],
        image: {
          url: "https://cdn.discordapp.com/attachments/1236007039873056818/1236013122523758602/paisaje-dibujos-animados-casa-japonesa-puente_771703-14413.png?ex=6636766c&is=663524ec&hm=672fecaf77122072bf5ee8d60dd739f4eab812f441bb5cad1c523814b3a817da&",
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
      const row = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
          .setCustomId("previous_page")
          .setLabel("Previous")
          .setStyle("Primary")
          .setDisabled(currentPage === 0),
        new ButtonBuilder()
          .setCustomId("next_page")
          .setLabel("Next")
          .setStyle("Primary")
          .setDisabled(currentPage === cataloguePages.length - 1),
      ]);

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
