const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require("discord.js");

module.exports = {
    name: "prevlist",
    category: "🔗〢Dev",
    run: async (client, message, args) => {
        if (!client.config.devs.includes(message.author.id)) return message.reply({ content: "T'as pas besoin de cette commande" });

        // Retrieve all previous names from the database
        let prevnames = await client.prevname.all()

        if (prevnames.length == 0) return message.channel.send("Aucun nom précédent trouvé dans la base de données.");

        let color = parseInt(client.color.replace('#', ''), 16);
        let embed = new EmbedBuilder()
            .setColor(color)
            .setTitle("Nombre d'utilisateurs enregistrés dans les prevnames")
            .setDescription(`\`${prevnames.length}\` prevnames enregistrés dans la base de données.`)
            .setTimestamp()
            .setFooter({ text: client.config.footer.text, iconURL: client.user.displayAvatarURL() });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle('Link')
                    .setLabel('Support')
                    .setURL(`https://discord.gg/clarityfr`)
                    .setEmoji("1208874952724451329")
            );

        await message.channel.send({ embeds: [embed], components: [row] });
    }
}
