const ms = require("ms");

module.exports = {
    name: "roleDelete",
    run: async (client, role) => {

        const db = client.antiraid.get(`secur_${channel.guild.id}`) || {
            antirole: {
                status: false,
                ignored_channel: [],
                ignored_role: [],
                ignored_user: [],
                sanction: "derank",
                logs: null,
                logs_status: false,
            }
        }

        
        if (!db.antirole || !db.antirole.status) return;
        const audit = await role.guild.fetchAuditLogs({type: 32, limit: 1}).then(a => a.entries.first())
        const member = await role.guild.members.fetch(audit?.executorId)

        if (db.antirole.ignored_role.some(r => member.roles.cache.has(r))) return;
        if (db.antirole.ignored_user.includes(member.id)) return;
        if (member.id === client.user.id) return;

        try{
            role.guild.roles.create({
                data: {
                    name: role.name,
                    color: role.hexColor,
                    permissions: role.permissions,
                    hoist: role.hoist,
                    mentionable: role.mentionable,
                    position: role.position,
                    highest: role.highest,
                    reason: `Clarity Anti-raid system`
                }
            })
          } catch{}

        switch(db.antirole.sanction){
            case "mute": return member.timeout(ms("15m"), "Clarity Anti-raid system").catch(() => false);
            case "kick": return member.kick("Clarity Anti-raid system").catch(() => false);
            case "ban": return member.ban({reason: "Clarity Anti-raid system"}).catch(() => false);
            case "derank": return member.roles.set([], "Clarity Anti-raid system").catch(() => false);
            case "warn": {
                const embed = new EmbedBuilder()
                    .setTitle("Warn")
                    .setDescription(`Vous avez été warn dans le serveur : ${member.guild.name}`)
                    .addFields({ name: "Raison", value: "Suppression de rôle"})
                    .addFields({ name: "Modérateur", value: `${client.user.tag}` })
                    .setColor(client.color)
                    .setFooter({text: client.config.footer})
                    .setTimestamp();

                member.send({ embeds: [embed] }).catch(() => false);
                    
                let warn = client.data.get(`warn_${member.guild.id}_${member.id}`) || [];
                warn.push({ reason: "Suppression de rôle", date: Date.now(), moderator: client.user.id });
                client.data.set(`warn_${member.guild.id}_${member.id}`, warn);
                break
            }
        }
    }
}