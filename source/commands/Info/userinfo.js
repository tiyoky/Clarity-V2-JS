const Discord = require('discord.js')
module.exports = {
    name: "userinfo",
    aliases: ['ui', 'user'],
   category: "💻〢Informations",
    run: async(client, message, args) => {
        const Badges = {
            'HypeSquadOnlineHouse1': client.emoji.bravery,
            'HypeSquadOnlineHouse2': client.emoji.brilliance,
            'HypeSquadOnlineHouse3': client.emoji.balance,
            'HypeSquadEvents': client.emoji.event,
            'ActiveDeveloper': client.emoji.activdev,
            'BugHunterLeve1': client.emoji.bughunt,
            'EarlySupporter': client.emoji.early,
            'VerifiedBotDeveloper': client.emoji.dev,
            'EarlyVerifiedBotDeveloper': client.emoji.earlydev,
            'VerifiedBot': client.emoji.botverif,
            'PartneredServerOwner': client.emoji.partner,
            'Staff': client.emoji.staff,
            'System': client.emoji.system,
            'BugHunterLevel2': client.emoji.bughunt2,
            'BugHunterLevel3': client.emoji.bughunt3,
        };

        let user = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => null);
        if (!user) {
            user = message.author;
        }
        let userMention = message.mentions.users.first();
        let member = userMention ? message.guild.members.cache.get(userMention.id) : null;
        if (!member) {
            let userId = args[0];
            member = userId ? message.guild.members.cache.get(userId) : message.member;
        } else if (!member) {
            console.error(`Member not found for user: ${user.id}`);
            return;
        }
        if (message.guild.members.cache.has(user.id)){
            const dateJoined = Math.floor(member.joinedTimestamp / 1000)
            const dateCreated = Math.floor(user.createdTimestamp / 1000)
            const url = await user.fetch().then((user) => user.bannerURL({ format: "png", dynamic: true, size: 4096 }));
            const badges = user.flags.toArray();
            let hasBadges = false;
            let userBadges = [];

            for (const badge of badges) {
                if (Badges[badge]) {
                    hasBadges = true;
                    userBadges.push(Badges[badge]);
                }
            }

            if (user.avatar.startsWith('a_')) {
                hasBadges = true;
                userBadges.push(client.emoji.nitro);
            }
            let status = member && member.presence && member.presence.status ? member.presence.status : 'offline';
            switch (status) {
                case 'online':
                    status = '🟢';
                    break;
                case 'idle':
                    status = '🌙';
                    break;
                case 'dnd':
                    status = '⛔';
                    break;
                default:
                    status = '⚫';
            }

            let statusperso = member && member.presence && member.presence.status !== 'offline' ? member.presence.activities[0]?.state || "Aucune activité" : "Aucune activité";
            let roles = member.roles.cache
            .filter(e => e?.id !== message.guild.id)
            .map((r) => `<@&${r.id}>`)
            .join("\n");

            if (roles.length > 1024) roles = roles.substring(0, 1020) + "...";
            let cms = ""
            client.guilds.cache.map(r =>{
             const list = client.guilds.cache.get(r.id);
             list.members.cache.map(m => (m.user.id ==user.id? cms++ : cms = cms))
             })
            let color =  parseInt(client.color.replace("#", ""), 16);
            message.channel.send({
                embeds: [{
                    color: color,
                    author: {
                        name: `À propos de ${user.username}`,
                        icon_url: user.displayAvatarURL({ dynamic: true })
                    },
                    footer: client.config.footer,
                    timestamp: new Date(),
                    description: `\`👑\` ┆ Nom D'affichage : [${user.displayName}](discord://-/users/${user.id})\n\`🛡️\` ┆ Pseudo : [${user.username}](discord://-/users/${user.id})\n\`🆔\` ┆ ID : [${user.id}](discord://-/users/${user.id})\n\`🎉\` ┆ Crée le : <t:${dateCreated}:d>\n\`❓\` ┆ Rejoins le : <t:${dateJoined}:d>\n\`🚨\` ┆ Serveurs en commun : ${cms}\n\`🎈\` ┆ Status: \`${status}\` - \`(${statusperso})\`\n\`🤖\` ┆ Robot: ${user.bot ? '\`✅\`' : '\`❌\`'}`,
                    image: {
                        url: url
                    },
                    thumbnail: {
                        url: user.displayAvatarURL({dynamic: true}),
                    }
                }
                ], components: [{
                    type: 1,
                    components: [
                        {
                            type: 2,
                            label: "Lien du profil",
                            url: `https://discord.com/users/${user.id}`,
                            style: 5
                        },
                        {
                            type: 2,
                            label: "Permissions",
                            customId: 'perm',
                            emoji: '🔒',
                            style: 2
                        },
                        {
                            type: 2,
                            label: "Badges",
                            customId: 'badges',
                            emoji: '💎',
                            disabled: !hasBadges,
                            style: 2
                        },
                        {
                            type: 2,
                            label: "Roles",
                            customId: 'roles',
                            emoji: '♾️',
                            disabled: roles.length === 0,
                            style: 2
                        }
                    ]
                }]
            })
            // collector
            const collector = message.channel.createMessageComponentCollector({ time: 60000 });
            collector.on('collect', async i => {
                if (i.customId === 'perm') {
                // retourne un embed en ephemeral avec toute les perms du membres
                    const embed = new Discord.EmbedBuilder()
                    .setColor(parseInt(client.color.replace("#", ""), 16))
                    .setAuthor({ name: `Permissions de ${user.username}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
                    .setFooter(client.config.footer)
                    .setTimestamp()
                    .addFields(
                        { name: 'Permissions', value: `${member.permissions.toArray().join('\n')}` }
                    )
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setImage(message.guild.iconURL({dynamic: true}) ? message.guild.iconURL({dynamic: true}) : message.author.bannerURL({dynamic: true}))
                    i.reply({ embeds: [embed], flags: 64})
                }
                if (i.customId === 'badges') {
                    const embed = new Discord.EmbedBuilder()
                        .setColor(parseInt(client.color.replace("#", ""), 16))
                    .setAuthor({ name: `Badges de ${user.username}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
                    .setFooter(client.config.footer)
                    .setTimestamp()
                    .addFields(
                        { name: `Badges [${userBadges.length}]`, value: `${userBadges.join('\n')}` }
                    )
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setImage(message.guild.iconURL({dynamic: true}) ? message.guild.iconURL({dynamic: true}) : message.author.bannerURL({dynamic: true}))
                    i.reply({ embeds: [embed], flags: 64})
                }
                if (i.customId === 'roles') {
                    const embed = new Discord.EmbedBuilder()
                        .setColor(parseInt(client.color.replace("#", ""), 16))
                    .setAuthor({ name: `Roles de ${user.username}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
                    .setFooter(client.config.footer)
                    .setTimestamp()
                    .addFields(
                        { name: `Roles`, value: `${roles}` }
                    )
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .setImage(message.guild.iconURL({dynamic: true}) ? message.guild.iconURL({dynamic: true}) : message.author.bannerURL({dynamic: true}))
                    i.reply({ embeds: [embed], flags: 64})
                }
            })
        } else {

            const dateCreated = Math.floor(user.createdTimestamp / 1000)
            const url = await user.fetch().then((user) => user.bannerURL({ format: "png", dynamic: true, size: 4096 }));
            console.log(url)
            let color =  parseInt(client.color.replace("#", ""), 16);
            message.channel.send({
                embeds: [{
                    color: color,
                    author: {
                        name: `À propos de ${user.username}`,
                        icon_url: user.displayAvatarURL({ dynamic: true })
                    },
                    footer: client.config.footer,
                    timestamp: new Date(),
                    description: `\`👑\` ┆ Nom D'affichage : [${user.displayName}](discord://-/users/${user.id})\n\`🛡️\` ┆ Pseudo : [${user.username}](discord://-/users/${user.id})\n\`🆔\` ┆ ID : [${user.id}](discord://-/users/${user.id})\n\`🎉\` ┆ Crée le : <t:${dateCreated}:d>\n`,
                    image: {
                        url: url
                    },
                    thumbnail: {
                        url: user.displayAvatarURL({dynamic: true}),
                    }
                }
                ]
            })
        }

    }
}