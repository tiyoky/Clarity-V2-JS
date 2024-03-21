const Discord = require("discord.js")
module.exports = {
    name: "kick",
  category: "📝〢Moderation",
    run: async (client, message, args) => {
        const db2 = client.data2.get(`modlogs_${message.guild.id}`) || {
            users: [],
            authors: [],
            sanctions: [],
            date: new Date().toISOString(),
            reason: null
        }
        const member = message.mentions.memebrs.first() || message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]).catch(() => false)
        if (!member) return message.channel.send({ content: `Aucun membre de trouvé pour \`${args[0] || "rien"}\`` })
        let buy = await client.db.any(`SELECT 1 FROM clarity_${client.user.id}_buyers WHERE user_id = $1`, member.id)

        if (member.roles.highest.position > message.member.roles.highest.position) return message.channel.send({ content: `Vous n'avez pas les permissions nécessaires pour **kick** ${member}` });
        if (member.user.id === client.user.id) return message.channel.send({ content: `Vous ne pouvez pas me kick` })
        if (member.user.id === message.author.id) return message.channel.send({ content: `Vous ne pouvez pas vous kick` })
        if (buy.includes(member.id)) return message.channel.send({ content: `Vous n'avez pas la permission de **kick** ${member}` });
        if (client.config.buyer.includes(member.id)) return message.channel.send({ content: `Vous n'avez pas la permission de **kick** ${member}` });
        if (!member.kickable) return message.channel.send({content: `Je n'ai pas les permissions pour kick ${member}`})

        member.kick(args.slice(1).join(' ') ?? "Aucune raison donnée")
            .then( () => {
                message.reply({ content: `**${member}** a été kick pour la raison : \`${args.slice(1).join(' ') ?? "Aucune raison donnée"}\``})
                db2.users.push(member.id)
                db2.authors.push(message.author.id)
                db2.sanctions.push("kick")
                db2.date = new Date().toISOString()
                db2.reason = args.slice(1).join(' ') ?? "Aucune raison donnée"
                client.data2.set(`modlogs_${message.guild.id}`, db2)
            })
            .catch(() => message.reply({content: `Je n'ai pas les permissions pour kick **${member}**`}))

    }
}