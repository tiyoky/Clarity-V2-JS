const ms = require("ms");

module.exports = {
    name: "channelCreate",
    run: async (client, channel) => {
        if (!channel.guild) return;
        let data = client.antiraid.get(`secur_${channel.guild.id}`) || {
            antichannel: {
                status: false,
                ignored_role: [],
                ignored_user: [],
                sanction: "mute",
                sanction_admin: "derank",
                rep: false,
                rep_limit: 5,
                logs: null,
                logs_status: false
            }
        }

        if (!data.antichannel || !data.antichannel.status) return;

        const audit = await channel.guild.fetchAuditLogs({ type: 10, limit: 1 }).then(a => a.entries.first());
        const member = await channel.guild.members.fetch(audit?.executorId)

        if (data.antichannel.ignored_role.some(r => member.roles.cache.has(r))) return;
        if (data.antichannel.ignored_user.includes(member.id)) return;
        if (member.id === client.user.id) return;
        
        channel.delete().catch(() => false)

        if (member.permissions.has('Administrator')) {
            switch(data.antichannel.sanction_admin){
                case "kick": return member.kick("Clarity Anti-raid system").catch(() => false);
                case "ban": return member.ban({reason: "Clarity Anti-raid system"}).catch(() => false);
                case "derank": return member.roles.set([], "Clarity Anti-raid system").catch(() => false);
        } 
    } else {

        switch(data.antichannel.sanction){
            case "mute": return member.timeout(ms("15m"), "Clarity Anti-raid system").catch(() => false);
            case "kick": return member.kick("Clarity Anti-raid system").catch(() => false);
            case "ban": return member.ban({reason: "Clarity Anti-raid system"}).catch(() => false);
            case "derank": return member.roles.set([], "Clarity Anti-raid system").catch(() => false);
            case "warn": {
                const embed = new EmbedBuilder()
                    .setTitle("Warn")
                    .setDescription(`Vous avez été warn dans le serveur : ${member.guild.name}`)
                    .addFields({ name: "Raison", value: "Création de salon"})
                    .addFields({ name: "Modérateur", value: `${client.user.tag}` })
                    .setColor(client.color)
                    .setFooter({text: client.config.footer})
                    .setTimestamp();

                member.send({ embeds: [embed] }).catch(() => false);
                    
                let warn = client.data.get(`warn_${member.guild.id}_${member.id}`) || [];
                warn.push({ reason: "Création de salons", date: Date.now(), moderator: client.user.id });
                client.data.set(`warn_${member.guild.id}_${member.id}`, warn);
                break
            }
        }
    }
    }
}