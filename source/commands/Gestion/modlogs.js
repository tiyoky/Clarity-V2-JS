const Discord = require("discord.js")
const { EmbedBuilder , ButtonBuilder, ActionRowBuilder } = require('discord.js');
module.exports = {
    name: "modlogs",
    description: "recuperer les modlogs d'un user",
    aliases : [],
    category: "📝〢Moderation",
    run: async (client, message, args) => {
        let color = parseInt(client.color.replace('#', ''), 16);
        const user = message.mentions.members.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(()=> {})
        if (!user) return message.reply({content: "Veuillez préciser l'utilisateur dont vous souhaitez voir les warns"})
        const db2 = client.data2.get(`modlogs_${message.guild.id}`) || {
            users: [],
            authors: [],
            sanctions: [],
            date: new Date().toISOString(),
            reason: null
        }


        // si l utilisateur n'est pas dans l array user return un message

        if (!db2.users.includes(user.id)) return message.reply({content: "Cet utilisateur n'a pas de logs de modération enregistrer contre lui"})

        // si l utilisateur n'a pas de sanction return un message
        if (!db2.sanctions.length) return message.reply({content: "Cet utilisateur n'a pas de logs de modération enregistrer contre lui"})
        // send embed with

        const embed = new EmbedBuilder()
            .setTitle(`Modlogs de ${user.username}`)
            .setColor(color)
            .addFields([{
                name: `Sanction`,
                value: `**Sanction :** ${db2.sanctions[0]}`
            }, {
                name: `Raison :`,
                value: db2.reason
            },{
                name: `Autheur :`,
                value: `<@${db2.authors[0]}>`
            }, {
                name: `Date :`,
                value: db2.date
            }])
            .setFooter(client.config.footer)


        message.reply({embeds: [embed]})


    }
}