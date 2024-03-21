module.exports = { 
    name: 'role',
    aliases: [],
    category: 'Info',
    utilisation: '{prefix}role',
    run: async(client, message, args) => {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
 
        if (member.bot) {
            return message.channel.send({embeds: [{
                color: parseInt(client.color.replace("#", ""), 16),
                description: `**${member.user.tag}** est un bot vous ne pouvez donc pas voir ses roles.`,
                footer: client.config.footer
            }]})
        }
 
       const roles = Array.from(member.roles.cache.sort((a, b) => a.position - b.position).map((role) => role.toString()))
       
       if (!roles.length) {
        return message.channel.send({embeds: [{
            color: parseInt(client.color.replace("#", ""), 16),
            description: `**${member.user.tag}** n'a aucun rôle.`,
            footer: client.config.footer
        }]})
       }
 
       const pageCount = Math.ceil(roles.length / 10);
       let page = 0;
 
       const roleList = roles.slice(page * 10, (page + 1) * 10).join('\n');
       let msg = await message.channel.send({embeds: [{
            author: {
                name: member.user.tag,
                icon_url: member.user.displayAvatarURL({dynamic: true})
            },
            color: parseInt(client.color.replace("#", ""), 16),
            description: roleList,
            footer: client.config.footer
        }], 
    components: [{
        type: 1,
        components: [
            {
                type: 2,
                label: '<<',
                style: 2,
                customId: 'prev' + message.id,
                disabled: page <= 0 ? true : false
            },
            {
                type: 2,
                label: '>>',
                style: 2,
                customId: 'next' + message.id,
                disabled: page >= pageCount - 1 ? true : false
            }
        ]
    }]
    })
 
    const filter = (i) => i.user.id === message.author.id
    const collector = msg.createMessageComponentCollector({ filter, time: 60000 })
 
    collector.on('collect', async(i) => {
        if (i.customId.startsWith('next')) {
            page++;
        } else if (i.customId.startsWith('prev')) {
            page--;
        }
 
        const roleList = roles.slice(page * 10, (page + 1) * 10).join('\n');
 
        await i.update({
            embeds: [{
                author: {
                   name: member.user.tag,
                   icon_url: member.user.displayAvatarURL({dynamic: true})
                },
                color: parseInt(client.color.replace("#", ""), 16),
                description: roleList,
                footer: client.config.footer
            }], 
            components: [{
                type: 1,
                components: [
                   {
                       type: 2,
                       label: '<<',
                       style: 2,
                       customId: 'prev' + message.id,
                       disabled: page <= 0 ? true : false
                   },
                   {
                       type: 2,
                       label: '>>',
                       style: 2,
                       customId: 'next' + message.id,
                       disabled: page >= pageCount - 1 ? true : false
                   }
                ]
            }]
        });
    })
    }
 }
 