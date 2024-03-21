const { EmbedBuilder , ButtonBuilder, ActionRowBuilder } = require('discord.js');
module.exports = {
    name: "lookup",
    description: "Lookup un utilisateur",
    aliases : [],
    category: "📝〢Information",
    usage: "lookup <user>",
    run: async (client, message, args) => {
        let color = parseInt(client.color.replace('#', ''), 16);
        let user = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => null);
        if (!user) {
            user = message.author;
        }

        // Récupérer à nouveau l'utilisateur pour s'assurer que nous avons les données les plus récentes y compris l'écran de fond
        user = await client.users.fetch(user.id, { force: true });

        // Obtenir l'URL de l'écran de fond
        const bannerURL = user.bannerURL({ format: 'png', size:   4096 });


       // embed qui retourne les infos : id , nom d affiache , nom d utilisateur , tag , date de creation , avatar , decoration , serveur en commun , nombre de role , badges , banniere
        let cms = ""
        client.guilds.cache.map(r =>{
            const list = client.guilds.cache.get(r.id);
            list.members.cache.map(m => (m.user.id ==user.id? cms++ : cms = cms))
        })
        // Convert the date to a string
        const createdAt = user.createdAt.toLocaleString();

// Assuming cms is a number, convert it to a string
        const commonServers = cms.toString();

// Assuming the number of roles is a number, convert it to a string
        const numberOfRoles = (message.guild.members.cache.get(user.id).roles.cache.size - 1).toString();

        const dateCreated = Math.floor(user.createdTimestamp / 1000)
        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle(user.username)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 4096 }))
            .addFields([{
                name: `ID :`,
                value: user.id,
                inline: true
            }, {
                name: `Nom d'affichage :`,
                value: user.displayName,
                inline: true
            }, {
                name: `Nom d'utilisateur :`,
                value: user.username,
                inline: true
            }, {
                name: `Date de création :`,
                value: `<t:${dateCreated}:d>`, // Converted to string
                inline: true
            }, {
                name : "Badges :",
                value : user.flags.toArray().join(", ") || "Aucun",
                inline: true
            }, {
                name: `Serveurs en commun :`,
                value: commonServers, // Converted to string
                inline: true
            }, {
                name: `Nombre de rôles :`,
                value: numberOfRoles, // Converted to string
                inline: true
            }])
            .setFooter(client.config.footer)

        if (bannerURL) {
            embed.setImage(bannerURL);
        }

      // boutton qui ramene vers le profile de l utilisateur
        const button = new ButtonBuilder()
          .setStyle(5)
          .setLabel('Lien du profil')
          .setURL(`https://discord.com/users/${user.id}`)


        const row = new ActionRowBuilder()
          .addComponents(button)
        message.reply({ embeds: [embed], components: [row] });

        // collector



    }
}