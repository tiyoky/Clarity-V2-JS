const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'variable',
    description: 'Shows all bot variable',
    category: 'Info',
    aliases: ['var'],
    run: async (client, message, args) => {
        let msg = await message.channel.send({content: 'chargement du module en cours . . .'})
        await embed(client, message, msg);
    }
}
async function embed(client, message, msg){
    let color = parseInt(client.color.replace('#', ''), 16);
    msg.edit({content: null ,embeds: [{
        color: color,
        title: 'Variable du bot',
        description: 'Clique sur le bouton correspondant aux variables qui t interesse',
        footer: client.config.footer
    }], components: [{
        type: 1,
        components: [{
            type: 2,
            label: 'join',
            value: 'join',
            style: 2,
            custom_id: 'join'
        },{
            type: 2,
            label: 'Compteur',
            value: 'counter',
            style: 2,
            custom_id: 'counter'
        }, { 
            type: 2,
            label: 'Level',
            value: 'level',
            style: 2,
            custom_id: 'level'
        }, {
            type: 2,
            label: 'Leave',
            value: 'leave',
            style: 2,
            custom_id: 'leave'
        }, {
            type: 2,
            label: 'AutoName',
            value: 'autoname',
            style: 2,
            custom_id: 'autoname'
        }
    ]
    }]})
    let collector = msg.createMessageComponentCollector({ time: 1000 * 60 });
    collector.on('collect', async (i) => {
        if(i.user.id != message.author.id) return i.reply({content: 'Tu ne peux pas utiliser les interactions d un autre utilisateur'})
        i.deferUpdate();
        if(i.customId == 'join'){
            let member = message.guild.members.cache.random()
            let invites = await message.guild.invites.fetch().catch(e=>{})
            let invite = invites?.first()
            let vanity = await message.guild.fetchVanityData().catch(e=>{})
            msg.edit({embeds: [{
                color: color,
                title: 'Variable de join',
                description: 'Clique sur le bouton correspondant aux variables qui t interesse',
            }], components: [{
                type: 1,
                components: [{
                    type: 2,
                    label: 'know_invite',
                    style: 2,
                    custom_id: 'knowinv'
                },{
                    type: 2,
                    label: 'vanity',
                    style: 2,
                    custom_id: 'vanityinv'
                }, { 
                    type: 2,
                    label: 'unknow_invite',
                    style: 2,
                    custom_id: 'unknowinv'
                }, {
                    type: 2,
                    label: 'himself_invite',
                    value: 'leave',
                    style: 2,
                    custom_id: 'himselfinv'
                }, {
                    type: 2,
                    label: 'Back',
                    style: 2,
                    custom_id: 'back'
                }
            ]
            }]
        })
    }
    if(i.customId == 'back'){
        msg.edit({content: null ,embeds: [{
            color: color,
            title: 'Variable du bot',
            description: 'Clique sur le bouton correspondant aux variables qui t interesse',
            footer: client.config.footer
        }], components: [{
            type: 1,
            components: [{
                type: 2,
                label: 'join',
                value: 'join',
                style: 2,
                custom_id: 'join'
            },{
                type: 2,
                label: 'Compteur',
                value: 'counter',
                style: 2,
                custom_id: 'counter'
            }, { 
                type: 2,
                label: 'Level',
                value: 'level',
                style: 2,
                custom_id: 'level'
            }, {
                type: 2,
                label: 'Leave',
                value: 'leave',
                style: 2,
                custom_id: 'leave'
            }, {
                type: 2,
                label: 'AutoName',
                value: 'autoname',
                style: 2,
                custom_id: 'autoname'
            }
        ]
        }]})
    }
    if(i.customId == 'knowinv'){
        let member = message.guild.members.cache.random()
        let invites = await message.guild.invites.fetch().catch(e=>{})
        let invite = invites?.first()
        let vanity = await message.guild.fetchVanityData().catch(e=>{});
        let inviter = invite.inviter;
        let inviterInfo = client.data.get('invitesStats_' + message.guild.id + '_' + invite.inviterId)
        invite.data = inviterInfo
        const varemb = new EmbedBuilder()
        .setColor(color)
        .setTitle('Join Variable')
        .setFooter(client.config.footer)
        .addFields({
            name: '[member]',
            value: `${member}`,
            inline: true
        }, {
            name: '[memberId]',
            value: `${member.user.id}`,
            inline: true
        }, {
            name: '[memberUsername]',
            value: `${member.user.username}`,
            inline: true
        }, {
            name: '[memberTotalJoin]',
            value: `${client.data.get(`joincount_${message.guild.id}_${member.id}`) ?? 0}`,
            inline: true
        }, {
            name: '[createdDate]',
            value: `<t:${member.user.createdTimestamp.toString().slice(0, -3)}>`,
            inline: true
        },{
            name: '[createdAt]',
            value: `<t:${member.user.createdTimestamp.toString().slice(0, -3)}:R>`,
            inline: true
        },  {
            name: '[serverName]',
            value: `${message.guild.name}`,
            inline: true
        }, {
            name: '[serverId]',
            value: `${message.guild.id}`,
            inline: true
        }, {
            name: '[serverMemberCount]',
            value: `${message.guild.memberCount}`,
            inline: true
        }, {
            name: '[serverBotCount]',
            value: `${message.guild.members.cache.filter(m => m.user.bot).size}`,
            inline: true
        }, {
            name: '[serverMemberCountNoBot]',
            value: `${message.guild.memberCount - message.guild.members.cache.filter(m => !m.user.bot).size}`,
            inline: true
        }, {
            name: '[serverCreatedDate]',
            value: `<t:${message.guild.createdTimestamp.toString().slice(0, -3)}>`,
            inline: true
        }, {
            name: '[serverCreatedAt]',
            value: `<t:${message.guild.createdTimestamp.toString().slice(0, -3)}:R>`,
            inline: true
        }, {
            name: '[serverBoostCount]',
            value: `${message.guild.premiumSubscriptionCount}`,
            inline: true
        }, {
            name: '[serverChannelsCount]',
            value: `${message.guild.channels.cache.size}`,
            inline: true
        }, {
            name: '[serverRolesCount]',
            value: `${message.guild.roles.cache.size}`,
            inline: true
        }, {
            name: '[inviter]',
            value: `${invite.inviter}`,
            inline: true
        }, {
            name: '[inviterId]',
            value: `${invite.inviter.id}`,
            inline: true
        }, {
            name: '[inviterUsername]',
            value: `${message.guild.members.cache.get(invite.inviter.id)?.user.username || '-introuvable-'}`,
            inline: true
        }, {
            name: '[inviterCreatedDate]',
            value: `<t:${invite.inviter.createdTimestamp.toString().slice(0, -3)}>`,
            inline: true
        }, {
            name: '[inviterCreatedAt]',
            value: `<t:${invite.inviter.createdTimestamp.toString().slice(0, -3)}:R>`,
            inline: true
        }, {
            name: '[inviteCode]',
            value: `${invite.code}`,
            inline: true
        }, {
            name: '[inviteUrl]',
            value: `${invite.url}`,
            inline: true
        }, {
            name: '[inviteUses]',
            value: `${invite.uses}`,
            inline: true
        })
        return msg.edit({embeds:[varemb]})
}
if(i.customId == 'vanityinv'){
    let member = message.guild.members.cache.random()
    let invites = await message.guild.invites.fetch().catch(e=>{})
    let invite = invites?.first()
    let vanity = await message.guild.fetchVanityData().catch(e=>{});
    const varemb = new EmbedBuilder()
    .setColor(color)
    .setTitle('Join Variable')
    .setFooter(client.config.footer)
    .addFields({
        name: '[member]',
        value: `${member}`,
        inline: true
    }, {
        name: '[memberId]',
        value: `${member.user.id}`,
        inline: true
    }, {
        name: '[memberUsername]',
        value: `${member.user.username}`,
        inline: true
    }, {
        name: '[memberTotalJoin]',
        value: `${client.data.get(`joincount_${message.guild.id}_${member.id}`) ?? 0}`,
        inline: true
    }, {
        name: '[createdDate]',
        value: `<t:${member.user.createdTimestamp.toString().slice(0, -3)}>`,
        inline: true
    },{
        name: '[createdAt]',
        value: `<t:${member.user.createdTimestamp.toString().slice(0, -3)}:R>`,
        inline: true
    },  {
        name: '[serverName]',
        value: `${message.guild.name}`,
        inline: true
    }, {
        name: '[serverId]',
        value: `${message.guild.id}`,
        inline: true
    }, {
        name: '[serverMemberCount]',
        value: `${message.guild.memberCount}`,
        inline: true
    }, {
        name: '[serverBotCount]',
        value: `${message.guild.members.cache.filter(m => m.user.bot).size}`,
        inline: true
    }, {
        name: '[serverMemberCountNoBot]',
        value: `${message.guild.memberCount - message.guild.members.cache.filter(m => !m.user.bot).size}`,
        inline: true
    }, {
        name: '[serverCreatedDate]',
        value: `<t:${message.guild.createdTimestamp.toString().slice(0, -3)}>`,
        inline: true
    }, {
        name: '[serverCreatedAt]',
        value: `<t:${message.guild.createdTimestamp.toString().slice(0, -3)}:R>`,
        inline: true
    }, {
        name: '[serverBoostCount]',
        value: `${message.guild.premiumSubscriptionCount}`,
        inline: true
    }, {
        name: '[serverChannelsCount]',
        value: `${message.guild.channels.cache.size}`,
        inline: true
    }, {
        name: '[serverRolesCount]',
        value: `${message.guild.roles.cache.size}`,
        inline: true
    }, { 
        name: '[vanityCode]',
        value: `${vanity.code}`,
        inline: true
    }, {
        name: '[vanityUrl]',
        value: `https://discord.gg/${vanity.code}`,
        inline: true
    }, {
        name: '[vanityUses]',
        value: `${vanity.uses}`,
        inline: true
    })
    return msg.edit({embeds:[varemb]})
}
if (i.customId == 'unknowinv') {
    let member = message.guild.members.cache.random()
    const varemb = new EmbedBuilder()
    .setColor(color)
    .setTitle('Join Variable')
    .setFooter(client.config.footer)
    .addFields({
        name: '[member]',
        value: `${member}`,
        inline: true
    }, {
        name: '[memberId]',
        value: `${member.user.id}`,
        inline: true
    }, {
        name: '[memberUsername]',
        value: `${member.user.username}`,
        inline: true
    }, {
        name: '[memberTotalJoin]',
        value: `${client.data.get(`joincount_${message.guild.id}_${member.id}`) ?? 0}`,
        inline: true
    }, {
        name: '[createdDate]',
        value: `<t:${member.user.createdTimestamp.toString().slice(0, -3)}>`,
        inline: true
    },{
        name: '[createdAt]',
        value: `<t:${member.user.createdTimestamp.toString().slice(0, -3)}:R>`,
        inline: true
    },  {
        name: '[serverName]',
        value: `${message.guild.name}`,
        inline: true
    }, {
        name: '[serverId]',
        value: `${message.guild.id}`,
        inline: true
    }, {
        name: '[serverMemberCount]',
        value: `${message.guild.memberCount}`,
        inline: true
    }, {
        name: '[serverBotCount]',
        value: `${message.guild.members.cache.filter(m => m.user.bot).size}`,
        inline: true
    }, {
        name: '[serverMemberCountNoBot]',
        value: `${message.guild.memberCount - message.guild.members.cache.filter(m => !m.user.bot).size}`,
        inline: true
    }, {
        name: '[serverCreatedDate]',
        value: `<t:${message.guild.createdTimestamp.toString().slice(0, -3)}>`,
        inline: true
    }, {
        name: '[serverCreatedAt]',
        value: `<t:${message.guild.createdTimestamp.toString().slice(0, -3)}:R>`,
        inline: true
    }, {
        name: '[serverBoostCount]',
        value: `${message.guild.premiumSubscriptionCount}`,
        inline: true
    }, {
        name: '[serverChannelsCount]',
        value: `${message.guild.channels.cache.size}`,
        inline: true
    }, {
        name: '[serverRolesCount]',
        value: `${message.guild.roles.cache.size}`,
        inline: true
    })

    return msg.edit({embeds:[varemb]})
}
if (i.customId == 'himselfinv') {
    let member = message.guild.members.cache.random()
    const varemb = new EmbedBuilder()
    .setColor(color)
    .setTitle('Join Variable')
    .setFooter(client.config.footer)
    .addFields({
        name: '[member]',
        value: `${member}`,
        inline: true
    }, {
        name: '[memberId]',
        value: `${member.user.id}`,
        inline: true
    }, {
        name: '[memberUsername]',
        value: `${member.user.username}`,
        inline: true
    }, {
        name: '[memberTotalJoin]',
        value: `${client.data.get(`joincount_${message.guild.id}_${member.id}`) ?? 0}`,
}, {
    name: '[createdDate]',
    value: `<t:${member.user.createdTimestamp.toString().slice(0, -3)}>`,
    inline: true
},{
    name: '[createdAt]',
    value: `<t:${member.user.createdTimestamp.toString().slice(0, -3)}:R>`,
    inline: true
},  {
    name: '[serverName]',
    value: `${message.guild.name}`,
    inline: true
}, {
    name: '[serverId]',
    value: `${message.guild.id}`,
    inline: true
}, {
    name: '[serverMemberCount]',
    value: `${message.guild.memberCount}`,
    inline: true
}, {
    name: '[serverBotCount]',
    value: `${message.guild.members.cache.filter(m => m.user.bot).size}`,
    inline: true
}, {
    name: '[serverMemberCountNoBot]',
    value: `${message.guild.memberCount - message.guild.members.cache.filter(m => !m.user.bot).size}`,
    inline: true
}, {
    name: '[serverCreatedDate]',
    value: `<t:${message.guild.createdTimestamp.toString().slice(0, -3)}>`,
    inline: true
}, {
    name: '[serverCreatedAt]',
    value: `<t:${message.guild.createdTimestamp.toString().slice(0, -3)}:R>`,
    inline: true
}, {
    name: '[serverBoostCount]',
    value: `${message.guild.premiumSubscriptionCount}`,
    inline: true
}, {
    name: '[serverChannelsCount]',
    value: `${message.guild.channels.cache.size}`,
    inline: true
}, {
    name: '[serverRolesCount]',
    value: `${message.guild.roles.cache.size}`,
    inline: true
})
return msg.edit({embeds:[varemb]})
}
if (i.customId == 'counter') {
    let vanity = await message.guild.fetchVanityData().catch(e=>{});
    const varemb = new EmbedBuilder()
    .setColor(color)
    .setTitle('Counter Variable')
    .setFooter(client.config.footer)
    .addFields({
        name: '[serverName]',
        value: `${message.guild.name}`,
        inline: true
    }, {
        name: '[serverId]',
        value: `${message.guild.id}`,
        inline: true
    }, {
        name: '[serverMemberCount]',
        value: `${message.guild.memberCount}`,
        inline: true
    }, {
        name: '[serverBotCount]',
        value: `${message.guild.members.cache.filter(m => m.user.bot).size}`,
        inline: true
    }, {
        name: '[serverMemberCountNoBot]',
        value: `${message.guild.memberCount - message.guild.members.cache.filter(m => !m.user.bot).size}`,
        inline: true
    }, {
        name: '[serverCreatedDate]',
        value: `<t:${message.guild.createdTimestamp.toString().slice(0, -3)}>`,
        inline: true
    }, {
        name: '[serverCreatedAt]',
        value: `<t:${message.guild.createdTimestamp.toString().slice(0, -3)}:R>`,
        inline: true
    }, {
        name: '[serverBoostCount]',
        value: `${message.guild.premiumSubscriptionCount}`,
        inline: true
    }, {
        name: '[serverChannelsCount]',
        value: `${message.guild.channels.cache.size}`,
        inline: true
    }, {
        name: '[serverRolesCount]',
        value: `${message.guild.roles.cache.size}`,
        inline: true
    }, {
        name: '[serverMemberOnline]',
        value: `${message.guild.members.cache.filter(m => m.presence && m.presence.status && m.presence.status == 'online').size}`,
        inline: true
    }, {
        name: '[serverMemberVocal]',
        value: `${message.guild.members.cache.filter(member => !member.user.bot && member.voice.channelId).size}`,
        inline: true
    }, {
        name: '[serverMemberOffline]',
        value: `${message.guild.members.cache.filter(m => m.presence && m.presence.status && m.presence.status === 'invisible').size}`,
        inline: true
    },{
        name: '[serverMemberIdle]',
        value: `${message.guild.members.cache.filter(m => m.presence && m.presence.status && m.presence.status === 'idle').size}`,
        inline: true
    },{
        name: '[serverMemberDnd]',
        value: `${message.guild.members.cache.filter(m => m.presence && m.presence.status && m.presence.status === 'dnd').size}`,
        inline: true
    }, {
        name: '[serverVanityUse]',
        value: `${vanity.uses}`,
        inline: true
    })
    return msg.edit({embeds:[varemb], components: [{
        type: 1,
        components: [{
            type: 2,
            label: 'join',
            value: 'join',
            style: 2,
            custom_id: 'join'
        },{
            type: 2,
            label: 'Compteur',
            value: 'counter',
            style: 2,
            custom_id: 'counter'
        }, { 
            type: 2,
            label: 'Level',
            value: 'level',
            style: 2,
            custom_id: 'level'
        }, {
            type: 2,
            label: 'Leave',
            value: 'leave',
            style: 2,
            custom_id: 'leave'
        }, {
            type: 2,
            label: 'AutoName',
            value: 'autoname',
            style: 2,
            custom_id: 'autoname'
        }
    ]
    }]})
}
if (i.customId == 'level') {
    let member = message.guild.members.cache.random()
    let channel = message.channel;
    const varemb = new EmbedBuilder()
    .setColor(color)
    .setTitle('Level Variable')
    .setFooter(client.config.footer)
    .addFields({
        name: '[member]',
        value: `${member}`,
        inline: true
    }, {
        name: '[memberId]',
        value: `${member.user.id}`,
        inline: true
    }, {
        name: '[memberUsername]',
        value: `${member.user.username}`,
        inline: true
    }, {
        name: '[memberTotalJoin]',
        value: `${client.data.get(`joincount_${message.guild.id}_${member.id}`) ?? 0}`,
        inline: true
    }, {
        name: '[createdDate]',
        value: `<t:${member.user.createdTimestamp.toString().slice(0, -3)}>`,
        inline: true
    },{
        name: '[createdAt]',
        value: `<t:${member.user.createdTimestamp.toString().slice(0, -3)}:R>`,
        inline: true
    }, {
        name: '[serverName]',
        value: `${message.guild.name}`,
        inline: true
    }, {
        name: '[serverId]',
        value: `${message.guild.id}`,
        inline: true
    }, {
        name: '[serverMemberCount]',
        value: `${message.guild.memberCount}`,
        inline: true
    }, {
        name: '[serverBotCount]',
        value: `${message.guild.members.cache.filter(m => m.user.bot).size}`,
}, {
        name: '[serverMemberCountNoBot]',
        value: `${message.guild.memberCount - message.guild.members.cache.filter(m => !m.user.bot).size}`,
        inline: true
}, {
        name: '[serverCreatedDate]',
        value: `<t:${message.guild.createdTimestamp.toString().slice(0, -3)}>`,
        inline: true
}, {
        name: '[serverCreatedAt]',
        value: `<t:${message.guild.createdTimestamp.toString().slice(0, -3)}:R>`,
        inline: true
}, {
        name: '[serverBoostCount]',
        value: `${message.guild.premiumSubscriptionCount}`,
        inline: true
}, {
        name: '[serverChannelsCount]',
        value: `${message.guild.channels.cache.size}`,
        inline: true
}, {
        name: '[serverRolesCount]',
        value: `${message.guild.roles.cache.size}`,
        inline: true
}, {
    name: '[channel]',
    value: `${channel}`,
    inline: true
}, {
    name: '[channelId]',
    value: `${channel.id}`,
    inline: true
}, {
    name: '[channelName]',
    value: `${channel.name}`,
    inline: true
}, {
    name: '[level]',
    value: `${client.data.has(`${message.guild.id}_${member.id}_level`)?client.data.get(`${message.guild.id}_${member.id}_level`):0}`,
    inline: true
})
    return msg.edit({embeds:[varemb], components: [{
        type: 1,
        components: [{
            type: 2,
            label: 'join',
            value: 'join',
            style: 2,
            custom_id: 'join'
        },{
            type: 2,
            label: 'Compteur',
            value: 'counter',
            style: 2,
            custom_id: 'counter'
        }, { 
            type: 2,
            label: 'Level',
            value: 'level',
            style: 2,
            custom_id: 'level'
        }, {
            type: 2,
            label: 'Leave',
            value: 'leave',
            style: 2,
            custom_id: 'leave'
        }, {
            type: 2,
            label: 'AutoName',
            value: 'autoname',
            style: 2,
            custom_id: 'autoname'
        }
        ]
}]});
    }
    if (i.customId == 'leave') {
        msg.edit({embeds: [{
            color: color,
            title: 'Variable de leave',
            description: 'Clique sur le bouton correspondant aux variables qui t interesse',
        }], components: [{
            type: 1,
            components: [{
                type: 2,
                label: 'know_leave',
                style: 2,
                custom_id: 'knowinvl'
            },{
                type: 2,
                label: 'vanity leave',
                style: 2,
                custom_id: 'vanityinvl'
            }, { 
                type: 2,
                label: 'unknow_leave',
                style: 2,
                custom_id: 'unknowinvl'
            }, {
                type: 2,
                label: 'Back',
                style: 2,
                custom_id: 'back'
            }
        ]
        }]
    })
    }
    if (i.customId == 'knowinvl') {
        let member = message.guild.members.cache.random()
        let invites = await message.guild.invites.fetch().catch(e=>{})
        let invite = invites?.first()
        let vanity = await message.guild.fetchVanityData().catch(e=>{});
        let inviter = invite.inviter;
        let inviterInfo = client.data.get('invitesStats_' + message.guild.id + '_' + invite.inviterId)
        invite.data = inviterInfo
        const varemb = new EmbedBuilder()
        .setColor(color)
        .setTitle('Leave Variable')
        .setFooter(client.config.footer)
        .addFields({
            name: '[member]',
            value: `${member}`,
            inline: true
        }, {
            name: '[memberId]',
            value: `${member.user.id}`,
            inline: true
        }, {
            name: '[memberUsername]',
            value: `${member.user.username}`,
            inline: true
        }, {
            name: '[memberTotalJoin]',
            value: `${client.data.get(`joincount_${message.guild.id}_${member.id}`) ?? 0}`,
            inline: true
        }, {
            name: '[createdDate]',
            value: `<t:${member.user.createdTimestamp.toString().slice(0, -3)}>`,
            inline: true
        },{
            name: '[createdAt]',
            value: `<t:${member.user.createdTimestamp.toString().slice(0, -3)}:R>`,
            inline: true
        },  {
            name: '[serverName]',
            value: `${message.guild.name}`,
            inline: true
        }, {
            name: '[serverId]',
            value: `${message.guild.id}`,
            inline: true
        }, {
            name: '[serverMemberCount]',
            value: `${message.guild.memberCount}`,
            inline: true
        }, {
            name: '[serverBotCount]',
            value: `${message.guild.members.cache.filter(m => m.user.bot).size}`,
            inline: true
        }, {
            name: '[serverMemberCountNoBot]',
            value: `${message.guild.memberCount - message.guild.members.cache.filter(m => !m.user.bot).size}`,
            inline: true
        }, {
            name: '[serverCreatedDate]',
            value: `<t:${message.guild.createdTimestamp.toString().slice(0, -3)}>`,
            inline: true
        }, {
            name: '[serverCreatedAt]',
            value: `<t:${message.guild.createdTimestamp.toString().slice(0, -3)}:R>`,
            inline: true
        }, {
            name: '[serverBoostCount]',
            value: `${message.guild.premiumSubscriptionCount}`,
            inline: true
        }, {
            name: '[serverChannelsCount]',
            value: `${message.guild.channels.cache.size}`,
            inline: true
        }, {
            name: '[serverRolesCount]',
            value: `${message.guild.roles.cache.size}`,
            inline: true
        }, {
            name: '[inviter]',
            value: `${invite.inviter}`,
            inline: true
        }, {
            name: '[inviterId]',
            value: `${invite.inviter.id}`,
            inline: true
        }, {
            name: '[inviterUsername]',
            value: `${message.guild.members.cache.get(invite.inviter.id)?.user.username || '-introuvable-'}`,
            inline: true
        }, {
            name: '[inviterCreatedDate]',
            value: `<t:${invite.inviter.createdTimestamp.toString().slice(0, -3)}>`,
            inline: true
        }, {
            name: '[inviterCreatedAt]',
            value: `<t:${invite.inviter.createdTimestamp.toString().slice(0, -3)}:R>`,
            inline: true
        }, {
            name: '[inviteCode]',
            value: `${invite.code}`,
            inline: true
        }, {
            name: '[inviteUrl]',
            value: `${invite.url}`,
            inline: true
        }, {
            name: '[inviteUses]',
            value: `${invite.uses}`,
            inline: true
        })
        return msg.edit({embeds:[varemb]})
    }
    if(i.customId == 'vanityinvl'){
        let member = message.guild.members.cache.random()
        let invites = await message.guild.invites.fetch().catch(e=>{})
        let invite = invites?.first()
        let vanity = await message.guild.fetchVanityData().catch(e=>{});
        const varemb = new EmbedBuilder()
        .setColor(color)
        .setTitle('Leave Variable')
        .setFooter(client.config.footer)
        .addFields({
            name: '[member]',
            value: `${member}`,
            inline: true
        }, {
            name: '[memberId]',
            value: `${member.user.id}`,
            inline: true
        }, {
            name: '[memberUsername]',
            value: `${member.user.username}`,
            inline: true
        }, {
            name: '[memberTotalJoin]',
            value: `${client.data.get(`joincount_${message.guild.id}_${member.id}`) ?? 0}`,
            inline: true
        }, {
            name: '[createdDate]',
            value: `<t:${member.user.createdTimestamp.toString().slice(0, -3)}>`,
            inline: true
        },{
            name: '[createdAt]',
            value: `<t:${member.user.createdTimestamp.toString().slice(0, -3)}:R>`,
            inline: true
        },  {
            name: '[serverName]',
            value: `${message.guild.name}`,
            inline: true
        }, {
            name: '[serverId]',
            value: `${message.guild.id}`,
            inline: true
        }, {
            name: '[serverMemberCount]',
            value: `${message.guild.memberCount}`,
            inline: true
        }, {
            name: '[serverBotCount]',
            value: `${message.guild.members.cache.filter(m => m.user.bot).size}`,
            inline: true
        }, {
            name: '[serverMemberCountNoBot]',
            value: `${message.guild.memberCount - message.guild.members.cache.filter(m => !m.user.bot).size}`,
            inline: true
        }, {
            name: '[serverCreatedDate]',
            value: `<t:${message.guild.createdTimestamp.toString().slice(0, -3)}>`,
            inline: true
        }, {
            name: '[serverCreatedAt]',
            value: `<t:${message.guild.createdTimestamp.toString().slice(0, -3)}:R>`,
            inline: true
        }, {
            name: '[serverBoostCount]',
            value: `${message.guild.premiumSubscriptionCount}`,
            inline: true
        }, {
            name: '[serverChannelsCount]',
            value: `${message.guild.channels.cache.size}`,
            inline: true
        }, {
            name: '[serverRolesCount]',
            value: `${message.guild.roles.cache.size}`,
            inline: true
        }, { 
            name: '[vanityCode]',
            value: `${vanity.code}`,
            inline: true
        }, {
            name: '[vanityUrl]',
            value: `https://discord.gg/${vanity.code}`,
            inline: true
        }, {
            name: '[vanityUses]',
            value: `${vanity.uses}`,
            inline: true
        })
        return msg.edit({embeds:[varemb]})
    }
    if(i.customId == 'unknowinvl') {
        let member = message.guild.members.cache.random()
        const varemb = new EmbedBuilder()
        .setColor(color)
        .setTitle('Leave Variable')
        .setFooter(client.config.footer)
        .addFields({
            name: '[member]',
            value: `${member}`,
            inline: true
        }, {
            name: '[memberId]',
            value: `${member.user.id}`,
            inline: true
        }, {
            name: '[memberUsername]',
            value: `${member.user.username}`,
            inline: true
        }, {
            name: '[memberTotalJoin]',
            value: `${client.data.get(`joincount_${message.guild.id}_${member.id}`) ?? 0}`,
            inline: true
        }, {
            name: '[createdDate]',
            value: `<t:${member.user.createdTimestamp.toString().slice(0, -3)}>`,
            inline: true
        },{
            name: '[createdAt]',
            value: `<t:${member.user.createdTimestamp.toString().slice(0, -3)}:R>`,
            inline: true
        },  {
            name: '[serverName]',
            value: `${message.guild.name}`,
            inline: true
        }, {
            name: '[serverId]',
            value: `${message.guild.id}`,
            inline: true
        }, {
            name: '[serverMemberCount]',
            value: `${message.guild.memberCount}`,
            inline: true
        }, {
            name: '[serverBotCount]',
            value: `${message.guild.members.cache.filter(m => m.user.bot).size}`,
            inline: true
        }, {
            name: '[serverMemberCountNoBot]',
            value: `${message.guild.memberCount - message.guild.members.cache.filter(m => !m.user.bot).size}`,
            inline: true
        }, {
            name: '[serverCreatedDate]',
            value: `<t:${message.guild.createdTimestamp.toString().slice(0, -3)}>`,
            inline: true
        }, {
            name: '[serverCreatedAt]',
            value: `<t:${message.guild.createdTimestamp.toString().slice(0, -3)}:R>`,
            inline: true
        }, {
            name: '[serverBoostCount]',
            value: `${message.guild.premiumSubscriptionCount}`,
            inline: true
        }, {
            name: '[serverChannelsCount]',
            value: `${message.guild.channels.cache.size}`,
            inline: true
        }, {
            name: '[serverRolesCount]',
            value: `${message.guild.roles.cache.size}`,
            inline: true
        })
    
        return msg.edit({embeds:[varemb]})
    }
    if(i.customId == 'autoname') {
        let member = message.guild.members.cache.random()
        const varemb = new EmbedBuilder()
        .setColor(color)
        .setTitle('AutoName Variable')
        .setFooter(client.config.footer)
        .addFields({
            name: '[memberId]',
            value: `${member.user.id}`,
            inline: true
        }, {
            name: '[memberUsername]',
            value: `${member.user.username}`,
            inline: true
        }
        )
        return msg.edit({embeds:[varemb], components: [{
            type: 1,
            components: [{
                type: 2,
                label: 'join',
                value: 'join',
                style: 2,
                custom_id: 'join'
            },{
                type: 2,
                label: 'Compteur',
                value: 'counter',
                style: 2,
                custom_id: 'counter'
            }, { 
                type: 2,
                label: 'Level',
                value: 'level',
                style: 2,
                custom_id: 'level'
            }, {
                type: 2,
                label: 'Leave',
                value: 'leave',
                style: 2,
                custom_id: 'leave'
            }, {
                type: 2,
                label: 'AutoName',
                value: 'autoname',
                style: 2,
                custom_id: 'autoname'
            }
            ]
    }]});
    }
    })

}