const Discord = require('discord.js');
const Clarity = require('../../structures/client/index');
const fs = require("fs");
const { StringSelectMenuBuilder, ActionRowBuilder, EmbedBuilder, ChannelSelectMenuComponent } = require('discord.js');
module.exports = {
    name: 'help', 
    description: 'help',
    category: "💻〢Informations",
    /**
     * 
     * @param {Clarity} client 
     * @param {Discord.Message} message
     */
    run: async (client, message) => {
let color = parseInt(client.color.replace("#", ""), 16)
        const prefix = client.prefix;
        const commandFiles = fs.readdirSync('./source/commands').filter(file => file.endsWith('.js'));
        const categories = fs.readdirSync('./source/commands');
        let data = await client.data.get(`settings_${client.user.id}`) || {
            style: null,
            image: null
        }
        let style = data.style ? data.style : 'onepage'
      if (style === "onepage") {
        const commandsByCategory = {};
        client.commands.forEach((command) => {
            if (!commandsByCategory[command.category]) {
              commandsByCategory[command.category] = [];
            }
            commandsByCategory[command.category].push(command);
          });
        //   emoji des categorie
        const categoryEmojis = {
          Bot: "🤖",
          Buyer: "🛠️",
          Dev: "📚",
          Gestion: "🔨",
          Info: "💻",
          Logs: "📄",
          Mod: "📝",
          Owner: "⚙️",
          Fun: "🎈",
          Antiraid: "⛔",
          Musique: "🎧"
        };
          let embed = new EmbedBuilder();
          embed.setColor(color);
          embed.setTitle(client.user.username);
          embed.setAuthor({
            name: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          embed.setDescription(`Mon prefix sur le serveur est : \`${prefix}\`\nNombres de commandes: \`${client.commands.size}\`\n\`${prefix}help <commande> pour plus d'info sur une commande\``);
          embed.setFooter(client.config.footer);
          embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }));
          embed.setImage(data.image ? data.image : client.user.displayAvatarURL({ dynamic: true }))
          embed.setTimestamp(new Date());
          for (const category in commandsByCategory) {
            const commands = commandsByCategory[category];
          const commandList = commands.map((command) => `\`${command.name}\``).join(', ');
          embed.addFields({
            name: `${categoryEmojis[category]}〢${category}`,
            value: commandList,
            inline: false,
          });
          }
          message.channel.send({ embeds: [embed] });
      }
      if (style == "buttons") {
          let page = 0;
          let pages = [];
          const categoryEmojis = {
            Bot: "🤖",
            Buyer: "🛠️",
            Dev: "📚",
            Gestion: "🔨",
            Info: "💻",
            Logs: "📄",
            Mod: "📝",
            Owner: "⚙️",
            Fun: "🎈",
            Antiraid: "⛔",
            Musique: "🎧"
          }
        const commandsByCategory = {};
        client.commands.forEach((command) => {
            if (!commandsByCategory[command.category]) {
              commandsByCategory[command.category] = [];
            }
            commandsByCategory[command.category].push(command);
        })

          // push les commands ds l array pages
          for (const category in commandsByCategory) {
            const commands = commandsByCategory[category];
            const commandList = commands.map((command) => `\`${command.name}\``).join(', ');
            pages.push({ name: `${categoryEmojis[category]}〢${category}`, value: commandList });
          }
        let msg = await message.channel.send({embeds: [{
            color: color,
            title: client.user.username,
            author: {
                name: client.user.username,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
            },
            description: `Mon prefix sur le serveur est : \`${prefix}\`\nNombres de commandes: \`${client.commands.size}\`\n\`${prefix}help <commande> pour plus d'info sur une commande\``,
            thumbnail: {url : client.user.displayAvatarURL({ dynamic: true })},
                // affiche la premiere page
            fields: pages[page],
           image: {url : data.image? data.image : client.user.displayAvatarURL({ dynamic: true })},
            footer: {
                text: client.config.footer.text + " " + `Commandes total: ${client.commands.size}`
        }}], components: [{
            type: 1,
            components: [{
                type: 2,
                label: '>>',
                style: 2,
                customId: 'next' + message.id,
                // bouton desactiver si c est la  derniere page de commande
                disabled: page == pages.length - 1 ? true : false
            } , {
                type: 2,
                label: '<<',
                style: 2,
                customId: 'prev' + message.id,
                // desactiver si premiere page
                disabled: page == 0 ? true : false
            }
            ]
        }]})



        const collector = await msg.createMessageComponentCollector({
            componentType: 2,
          });
        collector.on("collect", async (i) => {
            if (i.user.id !== message.author.id) return i.reply({
                content: "Vous ne pouvez pas utiliser ce boutton",
                ephemeral: true
              })
              i.deferUpdate()
            if (i.customId == "next" + message.id){
                page++
                msg.edit({

                    embeds: [{
                        color: color,
                        title: client.user.username,
                        author: {
                            name: client.user.username,
                            iconURL: client.user.displayAvatarURL({ dynamic: true }),
                        },
                        thumbnail: {url : client.user.displayAvatarURL({ dynamic: true })},
                        fields: pages[page],
                        image: {url : data.image? data.image : client.user.displayAvatarURL({ dynamic: true })},
                        footer: {
                            text: client.config.footer.text + " " + `Commandes total: ${client.commands.size}`
                        }
                    }],
                    components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        label: '>>',
                        style: 2,
                        customId: 'next' + message.id,
                        // desactiver si derniere page
                        disabled: page == Math.ceil(client.commands.size / 10) - 1 ? true : false
                    } , {
                        type: 2,
                        label: '<<',
                        style: 2,
                        customId: 'prev' + message.id,
                        // desactiver si premiere page
                        disabled: page == 0 ? true : false
                    }
                    ]
                }]})
            }
            if (i.customId == "prev" + message.id){
                page--
                msg.edit({

                    embeds: [{
                        color: color,
                        title: client.user.username,
                        author: {
                            name: client.user.username,
                            iconURL: client.user.displayAvatarURL({ dynamic: true }),
                        },
                        thumbnail: {url : client.user.displayAvatarURL({ dynamic: true })},
                        fields: pages[page],
                        image: {url : data.image? data.image : client.user.displayAvatarURL({ dynamic: true })},
                        footer: {
                            text: client.config.footer.text + " " + `Commandes total: ${client.commands.size}`
                        }
                    }],
                    components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        label: '>>',
                        style: 2,
                        customId: 'next' + message.id,
                        // desactiver si derniere page
                        disabled: page == Math.ceil(client.commands.size / 10) - 1 ? true : false
                    } , {
                        type: 2,
                        label: '<<',
                        style: 2,
                        customId: 'prev' + message.id,
                        // desactiver si premiere page
                        disabled: page == 0 ? true : false
                    }]
                    }]
                })
            }
        })
        }
      if (style == "menu"){
          let embed = new EmbedBuilder()
          embed.setTitle("Page d'aide des commandes")
          embed.setColor(color)
          embed.setTimestamp()
          embed.setFooter(client.config.footer)
          embed.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
          embed.setImage(data.image ? data.image : client.user.displayAvatarURL({ dynamic: true }))
          embed.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          embed.setDescription(`Mon prefix sur le serveur est : \`${prefix}\`\nNombres de commandes: \`${client.commands.size}\``)
          const commandFiles = fs.readdirSync('./source/commands').filter(file => file.endsWith('.js'));

          const categories = fs.readdirSync('./source/commands');
          let selectMenuOptions = categories.map(category => ({
              label: category,
              value: category,
              description: `Affiche les commandes de la catégorie ${category}`
          }));
          const selectMenu = new StringSelectMenuBuilder()
              .setCustomId('commandes-menu' + message.id)
              .setPlaceholder('Choisissez une catégorie')
              .addOptions(selectMenuOptions);

          const actionRow = new ActionRowBuilder()
              .addComponents(selectMenu);
          await message.reply({ embeds: [embed], components: [actionRow] }).then(() => {
              const filter = i => i.user.id === message.author.id;
              const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });
              collector.on('collect', async i => {
                  if (i.customId === 'commandes-menu' + message.id) {
                      const category = i.values[0];
                      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                      const categoryEmbed = new EmbedBuilder()
                          .setColor(color)
                          .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                          .setFooter(client.config.footer)
                          .setTitle(`🎩 Voici les commandes de la catégorie ${categoryName} :`)
                          .setTimestamp()
                          .setImage(data.image ? data.image : client.user.displayAvatarURL({ dynamic: true }))

                      const commandFiles = fs.readdirSync(`./source/commands/${category}`).filter(file => file.endsWith('.js'));

                      let commandList = [];

                      for (const file of commandFiles) {
                          const command = require(`../${category}/${file}`);
                          commandList.push(`\`${prefix}${command.name}\`\n${command.description ? command.description :  'Aucune description.'}`);
                      }

                      if (commandList.length) {
                          categoryEmbed.setDescription(commandList.join('\n'));
                      } else {
                          categoryEmbed.setDescription('Aucune commande trouvée dans cette catégorie.');
                      }

                      i.update({ embeds: [categoryEmbed], components: [actionRow] });
                  }
              });
          })
      }
      }

     }