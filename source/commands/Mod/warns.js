const Discord = require("discord.js")
const { EmbedBuilder , ButtonBuilder, ActionRowBuilder } = require('discord.js');
module.exports = {
    name: "warns",
    description: "recuperer les warns d 'un user",
    aliases : [],
  category: "📝〢Moderation",
    run: async (client, message, args) => {
        let color = parseInt(client.color.replace('#', ''), 16);
        const user = message.mentions.members.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(()=> {})
        if (!user) return message.reply({content: "Veuillez préciser l'utilisateur dont vous souhaitez voir les warns"})
        const warns = client.data2.get(`warns_${message.guild.id}_${user.id}`) || []

        // if the user doesn't have any warns return a message
        if (!warns.length) return message.reply({content: "Cet utilisateur n'a pas de warns"})

        // send embed with pagination system


        const embed = new EmbedBuilder()
            .setTitle(`Warns de ${user.username}`)
            .setColor(color)
            .addFields([{
                name: `Warn #1`,
                value: `**Warn par :** <@${warns[0].author_id}>`
            }, {
                name: `Raison :`,
                value: warns[0].reason
            }, {
                name: `Date :`,
                value: warns[0].date
            }])
            .setFooter(client.config.footer)



        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('previous' + message.id)
                    .setLabel('<<')
                    .setStyle('Primary'),
                new ButtonBuilder()
                    .setCustomId('next' + message.id)
                    .setLabel('>>')
                    .setStyle('Primary')
            )

        const msg = await message.channel.send({embeds: [embed], components: [row]})

        // create collector for the pagination
        const filter = i => i.user.id === message.author.id
        const collector = message.channel.createMessageComponentCollector({filter, time: 60000})
        let page = 0
        collector.on('collect', async i => {
            if (i.customId.startsWith('previous')) {
                if (page === 0) return
                page--
            } else {
                if (page === warns.length - 1) return
                page++
            }
            const embed = new EmbedBuilder()
                .setTitle(`Warns de ${user.username}`)
                .setColor(color)
                .addFields([{
                    name: `Warn #${warns[page].warn_id}`,
                    value: `**Warn par :** <@${warns[page].author_id}>`
                }, {
                    name: `Raison :`,
                    value: warns[page].reason
                }, {
                    name: `Date :`,
                    value: warns[page].date
                }])
                .setFooter(client.config.footer)
            i.update({embeds: [embed]})
        })



    }
}