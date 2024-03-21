const ms = require("ms");

module.exports = {
    name: "guildUpdate",
    run: async (client, oldGuild, newGuild) => {
        let data = client.antiraid.get(`secur_${oldGuild.id}`) || {
            antiguild: {
                status: false,
                ignored_channel: [],
                ignored_role: [],
                ignored_user: [],
                sanction: "derank",
                logs: null,
                logs_status: false,
            }
        }

        if (!data.antiguild || !data.antiguild.status) return;

        const audit = await member.guild.fetchAuditLogs({ type: 1, limit: 1 }).then(a => a.entries.first());
        const member = await member.guild.members.fetch(audit?.executorId)

        if (data.antiguild.ignored_role.some(r => member.roles.cache.has(r))) return;
        if (data.antiguild.ignored_user.includes(member.id)) return;
        if (member.id === client.user.id) return;

        switch(data.antiguild.sanction){
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
                    
                let warn = client.data.get(`warn_${oldGuild.id}_${member.id}`) || [];
                warn.push({ reason: "Ajout de bot", date: Date.now(), moderator: client.user.id });
                client.data.set(`warn_${oldGuild.id}_${member.id}`, warn);
                break
            }
        }

        if (oldGuild.name !== newGuild.name) await newGuild.setName(oldGuild.name)
        if (oldGuild.region !== newGuild.region) await newGuild.setRegion(oldGuild.region)
        if (oldGuild.widget !== newGuild.widget) await newGuild.setWidget(oldGuild.widget)
        if (oldGuild.splashURL !== newGuild.splashURL) await newGuild.setSplash(oldGuild.splashURL)
        if (oldGuild.bannerURL() !== newGuild.bannerURL()) await newGuild.setBanner(oldGuild.bannerURL())
        if (oldGuild.afkChannel !== newGuild.afkChannel) await newGuild.setAFKChannel(oldGuild.afkChannel)
        if (oldGuild.afkTimeout !== newGuild.afkTimeout) await newGuild.setAFKTimeout(oldGuild.afkTimeout)
        if (oldGuild.rulesChannel !== newGuild.rulesChannel) await newGuild.setRulesChannel(oldGuild.rulesChannel)
        if (oldGuild.systemChannel !== newGuild.systemChannel) await newGuild.setSystemChannel(oldGuild.systemChannel)
        if (oldGuild.verificationLevel !== newGuild.verificationLevel) await newGuild.setVerificationLevel(oldGuild.verificationLevel)
        if (oldGuild.systemChannelFlags !== newGuild.systemChannelFlags) await newGuild.setSystemChannelFlags(oldGuild.systemChannelFlags)
        if (oldGuild.position !== newGuild.position) await newGuild.setChannelPositions([{ channel: oldGuild.id, position: oldGuild.position }])
        if (oldGuild.publicUpdatesChannel !== newGuild.publicUpdatesChannel) await newGuild.setPublicUpdatesChannel(oldGuild.publicUpdatesChannel)
        if (oldGuild.iconURL({ dynamic: true }) !== newGuild.iconURL({ dynamic: true })) await newGuild.setIcon(oldGuild.iconURL({ dynamic: true }))
        if (oldGuild.defaultMessageNotifications !== newGuild.defaultMessageNotifications) await newGuild.setDefaultMessageNotifications(oldGuild.defaultMessageNotifications)
    }
}