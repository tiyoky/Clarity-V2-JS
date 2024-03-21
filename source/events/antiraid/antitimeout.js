const { EmbedBuilder } = require("discord.js");
const ms = require("ms");
module.exports = {
    name: "guildMemberUpdate",
    run: async (client, oldMember, newMember) => {
        if (oldMember.user.id === client.user.id) return;

        let data = client.antiraid.get(`secur_${newMember.guild.id}`) || {
            antiTimeout: {
                status: false,
                ignored_role: [],
                ignored_user: [],
                sanction: "mute",
                logs: null,
                logs_status: false
            }
        };
        const { antiTimeout } = data;
        if (!antiTimeout || !antiTimeout.status) return;
        const { ignored_role, ignored_user } = antiTimeout;
        if (ignored_user.includes(newMember.id) || newMember.roles.cache.some(r => ignored_role.includes(r.id))) return;


        if (antiTimeout.status !== true) return;
        const timeout = await newMember.guild.fetchAuditLogs({ type: 24, limit: 1 }).then(a => a.entries.first());

        const member = await newMember.guild.members.fetch(timeout?.executorId);

        if (data.antichannel.ignored_role.some(r => member.roles.cache.has(r))) return;
        if (data.antichannel.ignored_user.includes(member.id)) return;
        if (member.id === client.user.id) return;

        newMember.timeout(0, "AntiTimeout");

        switch (data.antiTimeout.sanction) {
            case "mute": return member.timeout(ms("15m"), "Clarity Anti-raid system");
            case "kick": return member.kick("Clarity Anti-raid system");
            case "ban": return member.ban({ reason: "Clarity Anti-raid system" });
            case "derank": return member.roles.set([], "Clarity Anti-raid system");
            case "warn": {
                const embed = new EmbedBuilder()
                    .setTitle("Warn")
                    .setDescription(`Vous avez été warn dans le serveur : ${member.guild.name}`)
                    .addFields({ name: "Raison", value: "Timeout un membre" })
                    .addFields({ name: "Modérateur", value: `${client.user.tag}` })
                    .setColor(client.color)
                    .setFooter({ text: client.config.footer })
                    .setTimestamp();

                member.send({ embeds: [embed] }).catch(() => false);

                let warn = client.data.get(`warn_${oldMember.guild.id}_${member.id}`) || [];
                warn.push({ reason: "Timeout un membre", date: Date.now(), moderator: client.user.id });
                client.data.set(`warn_${oldMember.guild.id}_${member.id}`, warn);
                break
            }
        }
    }
}