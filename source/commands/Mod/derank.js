const Discord = require("discord.js")

module.exports = {
    name: "derank",
    description: "derank un user",
    aliases : [],
    category: "📝〢Moderation",
    parm: 1,
    run: async (client, message, args) => {
        const db2 = client.data2.get(`modlogs_${message.guild.id}`) || {
            users: [],
            authors: [],
            sanctions: [],
            date: new Date().toISOString(),
            reason: null
        }


        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await message.guild.memebrs.fetch(args[0]).catch(() => false)
        if(!member) return message.channel.send({ content: `Aucun membre trouvée pour: \`${args[0] || "rien"}\`` })
        if (member.roles.highest.position > message.member.roles.highest.position) return message.channel.send({ content: `Vous n'avez pas les permissions nécessaires pour **derank** ${member}` });
        if (member.user.id === client.user.id) return message.channel.send({ content: `Vous ne pouvez pas me derank` })
        if (member.user.id === message.author.id) return message.channel.send({ content: `Vous ne pouvez pas vous derank` })
        if (buy.includes(member.id)) return message.channel.send({ content: `Vous n'avez pas la permission de **derank** ${member}` });
        if (client.config.buyer.includes(member.id)) return message.channel.send({ content: `Vous n'avez pas la permission de **derank** ${member}` });
          
        member.roles?.set([], `Derank par ${message.author.username}`)
            .then( () => {
                message.channel.send({ content: `${member} à été **derank**` });
                db2.users.push(user.id)
                db2.authors.push(message.author.id)
                db2.sanctions.push("derank")
                db2.date = new Date().toISOString()
                db2.reason = "derank par" + message.author.username;
                client.data2.set(`modlogs_${message.guild.id}`, db2)
            })
            .catch(() => message.reply(`Je n'ai pas pu **derank** ${member}`))
    }
}