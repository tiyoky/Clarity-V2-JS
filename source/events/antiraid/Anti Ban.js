const ms = require("ms")

module.exports = {
    name: "guildBanAdd",
    run: async (client, ban) => {
        if (!ban.guild || !ban.user) return;
        let data = client.antiraid.get(`secur_${ban.guild.id}`) || {
            antiban: {
                status: false,
                ignored_channel: [],
                ignored_role: [],
                ignored_user: [],
                sanction: "derank",
                logs: null,
                logs_status: false,
            }
        }

        if (!data.antiban || !data.antiban.status) return;

        const audit = await ban.guild.fetchAuditLogs({ type: 22, limit: 1 }).then(a => a.entries.first());
        const member = await ban.guild.members.fetch(audit?.executorId)

        if (data.antiban.ignored_role.some(r => member.roles.cache.has(r))) return;
        if (data.antiban.ignored_user.includes(member.id)) return;
        if (member.id === client.user.id) return;

        ban.guild.bans.remove(ban.user.id, "Clarity Anti-raid system").catch(() => false)

        switch(data.antiban.sanction){
            case "mute": return member.timeout(ms("15m"), "Clarity Anti-raid system").catch(() => false);
            case "kick": return member.kick("Clarity Anti-raid system").catch(() => false);
            case "ban": return member.ban({reason: "Clarity Anti-raid system"}).catch(() => false);
            case "derank": return member.roles.set([], "Clarity Anti-raid system").catch(() => false);
            case "warn": {
                const embed = new EmbedBuilder()
                    .setTitle("Warn")
                    .setDescription(`Vous avez été warn dans le serveur : ${member.guild.name}`)
                    .addFields({ name: "Raison", value: "Banissement d'un membre"})
                    .addFields({ name: "Modérateur", value: `${client.user.tag}` })
                    .setColor(client.color)
                    .setFooter({text: client.config.footer})
                    .setTimestamp();

                member.send({ embeds: [embed] }).catch(() => false);
                    
                let warn = client.data.get(`warn_${member.guild.id}_${member.id}`) || [];
                warn.push({ reason: "Ajout de bot", date: Date.now(), moderator: client.user.id });
                client.data.set(`warn_${member.guild.id}_${member.id}`, warn);
                break
            }
        }

    }
}