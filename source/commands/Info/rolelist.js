module.exports = {
    name: 'rolelist',
    aliases: ['rl'],
    description: 'Listez les rôles du serveur',
    category: 'Info',
    run: async(client, message, args) => {
        const roles = Array.from(message.guild.roles.cache.values());
        roles.sort((a, b) => b.position - a.position);
        let page = 0;
        const pageCount = Math.ceil(roles.length / 10);  
        // Send the first page
        let msg = await message.channel.send({
            embeds: [{
                color: parseInt(client.color.replace("#", ""), 16),
                title: `Liste des rôles du serveur ${message.guild.name}`,
                description: roles.slice(page * 10, (page + 1) * 10).join(" | "),
                footer: {text: roles.length+ ' roles' + ' ' + client.config.footer.text}
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
  
        // Create the collector
        const filter = (i) => i.user.id === message.author.id
        const collector = msg.createMessageComponentCollector({ filter, time: 60000 })
  
        // Handle button clicks
        collector.on('collect', async (i) => {
            if (i.customId.startsWith('next')) {
                page++;
                i.update({
                  embeds: [{
                      color: parseInt(client.color.replace("#", ""), 16),
                      title: `Liste des rôles du serveur ${message.guild.name}`,
                      description: roles.slice(page * 10, (page + 1) * 10).join(" | "),
                      footer: {text: roles.length+ ' roles' + ' ' + client.config.footer.text}
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
            } else if (i.customId.startsWith('prev')) {
                page--;
                i.update({
                  embeds: [{
                      color: parseInt(client.color.replace("#", ""), 16),
                      title: `Liste des rôles du serveur ${message.guild.name}`,
                      description: roles.slice(page * 10, (page + 1) * 10).join(" | "),
                      footer: {text: roles.length+ ' roles' + ' ' + client.config.footer.text}
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
            }
        });
    }
  };
  