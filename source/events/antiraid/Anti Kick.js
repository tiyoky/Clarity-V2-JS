const ms = require("ms")

module.exports = {
    name: "guildMemberRemove",
    run: async (client, member) => {
        if (!member.guild || !member.user) return;
        let data = client.antiraid.get(`secur_${member.guild.id}`) || {
            antikick: {
                status: false,
                ignored_channel: [],
                ignored_role: [],
                ignored_user: [],
                sanction: "derank",
                logs: null,
                logs_status: false,
            }
        }

        if (!data.antikick || !data.antikick.status) return;

        const audit = await member.guild.fetchAuditLogs({ type: 20, limit: 1 }).then(a => a.entries.first());
        const executor = await member.guild.members.fetch(audit?.executorId)

        if (data.antikick.ignored_role.some(r => executor.roles.cache.has(r))) return;
        if (data.antikick.ignored_user.includes(executor.id)) return;
        if (executor.id === client.user.id) return;

        switch(data.antikick.sanction){
            case "mute": return executor.timeout(ms("15m"), "Clarity Anti-raid system").catch(() => false);
            case "kick": return executor.kick("Clarity Anti-raid system").catch(() => false);
            case "member": return executor.ban({reason: "Clarity Anti-raid system"}).catch(() => false);
            case "derank": return executor.roles.set([], "Clarity Anti-raid system").catch(() => false);
            case "warn": {
                const embed = new EmbedBuilder()
                    .setTitle("Warn")
                    .setDescription(`Vous avez été warn dans le serveur : ${member.guild.name}`)
                    .addFields({ name: "Raison", value: "Expulse un membre"})
                    .addFields({ name: "Modérateur", value: `${client.user.tag}` })
                    .setColor(client.color)
                    .setFooter({text: client.config.footer})
                    .setTimestamp();

                executor.send({ embeds: [embed] }).catch(() => false);
                    
                let warn = client.data.get(`warn_${member.guild.id}_${executor.id}`) || [];
                warn.push({ reason: "Expulse un membre", date: Date.now(), moderator: client.user.id });
                client.data.set(`warn_${member.guild.id}_${executor.id}`, warn);
                break
            }
        }

    }
}