module.exports = {
    name: 'warn',
  category: "📝〢Moderation",
    run: async (client, message, args) => {
        let color =  parseInt(client.color, 16);


        const db2 = client.data2.get(`modlogs_${message.guild.id}`) || {
            users: [],
            authors: [],
            sanctions: [],
            date: new Date().toISOString(),
            reason: null
        }
        let member =  message.mentions.members.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(()=> {})
        if (!member) return message.reply({content: "Veuillez précisé un membre"})
        if (!args[1]) return message.reply({content: "Veuillez précisé une raison"})
        const warns = client.data2.get(`warns_${message.guild.id}_${member.id}`) || []
        if (member.id === message.author.id) return message.reply({content: "Vous ne pouvez pas vous warn"})

        if (member.id === client.user.id) {
            return message.reply({content: "Je ne peux pas warn cet utilisateur"})
        }

      // add warn to the user

        warns.push({
            warn_id: warns.length + 1,
            user_id: member.id,
            reason: args.slice(1).join(" "),
            author_id: message.author.id,
            date: new Date().toISOString()
        })
        client.data2.set(`warns_${message.guild.id}_${member.id}`, warns)



        db2.users.push(member.id)
        db2.authors.push(message.author.id)
        db2.sanctions.push("warn")
        db2.date = new Date().toISOString()
        db2.reason = args.slice(1).join(" ")
        client.data2.set(`modlogs_${message.guild.id}`, db2)
        return message.reply({content: `${member} a bien été warn pour la raison : ${args.slice(1).join(" ")}`})
    }
}