const ms = require("ms");

module.exports = {
    name: "guildMemberAdd",
    run: async (client, member) => {
        if (!member.user.bot) return;
        
        let data = client.antiraid.get(`secur_${member.guild.id}`) || {
            antibot: {
                status: false,
                ignored_channel: [],
                ignored_role: [],
                ignored_user: [],
                sanction: "derank",
                logs: null,
                logs_status: false,
            }
        }

        if (!data.antibot || !data.antibot.status) return;

        const audit = await member.guild.fetchAuditLogs({ type: 28, limit: 1 }).then(a => a.entries.first());
        const executor = await member.guild.members.fetch(audit?.executorId)

        if (data.antibot.ignored_role.some(r => executor.roles.cache.has(r))) return;
        if (data.antibot.ignored_user.includes(executor.id)) return;
        if (executor.id === client.user.id) return;

        member.kick("Clarity Anti-raid system").catch(() => false)

        switch(data.antibot.sanction){
            case "mute": return executor.timeout(ms("15m"), "Clarity Anti-raid system").catch(() => false);
            case "kick": return executor.kick("Clarity Anti-raid system").catch(() => false);
            case "ban": return executor.ban({reason: "Clarity Anti-raid system"}).catch(() => false);
            case "derank": return executor.roles.set([], "Clarity Anti-raid system").catch(() => false);
            case "warn": {
                const embed = new EmbedBuilder()
                    .setTitle("Warn")
                    .setDescription(`Vous avez été warn dans le serveur : ${executor.guild.name}`)
                    .addFields({ name: "Raison", value: "Création de salon"})
                    .addFields({ name: "Modérateur", value: `${client.user.tag}` })
                    .setColor(client.color)
                    .setFooter({text: client.config.footer})
                    .setTimestamp();

                executor.send({ embeds: [embed] }).catch(() => false);
                    
                let warn = client.data.get(`warn_${executor.guild.id}_${executor.id}`) || [];
                warn.push({ reason: "Ajout de bot", date: Date.now(), moderator: client.user.id });
                client.data.set(`warn_${executor.guild.id}_${executor.id}`, warn);
                break
            }
        }
    }
}