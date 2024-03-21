const {EmbedBuilder} = require("discord.js")
const banner = require("discord-bnr")
module.exports = {
    name: "setbot",
    aliases: ["setprofil"],
    description: "Permet de modifier le profil du bot",
    category: "🛠️〢Buyer",
    /**
     * @param {Clarity} client
     */
    run: async (client, message, args) => {
        const isOwn = await client.db.oneOrNone(
            `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
            [message.author.id]
        );
        if (!isOwn) {
            return message.reply({
                content: " vous n'avez pas la permission d'utiliser cette commande",
            });
        }
      
       let msg = await message.channel.send({content: "Chargement du module . . ."})
       await update(client, message, msg)
        }
        }

        async function update(client, message, msg) {
            let db = client.data2.get(`${client.user.id}_bot_status`) || {
                type: 'custom',
                status: `Clarity ${client.version.version}`,
                presence: 'dnd',
                url: "tsubasa_poulpy"
            }
            let color = parseInt(client.color.replace('#', ''), 16);
            msg.edit({
                content: null,
                embeds: [new EmbedBuilder({
                    title: client.user.username + " " + "Custom Panel",
                     thumbnail: {
                                            url: ''
                                        },
                    color: color,
                    footer: client.config.footer,
                    timestamp: new Date(),
                    fields: [
                        {name: "Nom du bot", value: client.user.username},
                        {name: "Status du bot", value: `${client.presence.status}`},
                        {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                    ],
                    image: {
                        url: client.user.avatarURL({dynamic: true})
                    }
                })
            ],
            components: [{
                type: 1,
                components: [{
                    type: 3,
                    custom_id: "botm" + msg.id,
                    options: [{
                        label: "Modifier le nom du bot",
                        value: "cname",
                        emoji: "1️⃣"
                    }, {
                        label: "Modifier le status du bot",
                        value: "cstatus",
                        emoji: "2️⃣"
                    }, {
                        label: "Modifier l'activité du bot",
                        value: "cactivity",
                        emoji: "3️⃣"
                    },{
                        label: "Modifier l'avatar du bot",
                        value: "cavatar",
                        emoji: "4️⃣"
                    }, {
                        label: "Modifier la banniere du bot",
                        value: "cbanner",
                        emoji: "5️⃣"
                    },{
                        label: "Annuler",
                        value: "cancel",
                        emoji: "❌"
                    }]
                }]
            }]
            })
            let collector = msg.createMessageComponentCollector({ time: 1000 * 60 });
            collector.on("collect", async i => {
                if (i.user.id !== message.author.id) return i.reply({ content: "Vous ne pouvez pas utiliser un menu qui n'est pas le vôtre", ephemeral: true });
                i.deferUpdate()
                if (i.customId === "botm" + msg.id) {
                    if (i.values[0] === "cname") {
                        let quest = await i.channel.send({content: "Quel est le nouveau nom du bot?"})
                        let rep = await i.channel.awaitMessages({filter: m => m.author.id == i.user.id, max: 1, time: 30_000})
                        if (rep.first()) {
                            quest.delete()
                            client.user.username = rep.first.content
                            client.user.setUsername(rep.first().content)
                            rep.first().delete()
                            msg.edit({
                                content: null,
                                embeds: [new EmbedBuilder({
                                    title: client.user.username + " " + "Custom Panel",
                                     thumbnail: {
                                            url: ''
                                        },
                                    color: color,
                                    footer: client.config.footer,
                                    timestamp: new Date(),
                                    fields: [
                                        {name: "Nom du bot", value: client.user.username},
                                        {name: "Status du bot", value: `${client.presence.status}`},
                                        {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                    ],
                                    image: {
                                        url: client.user.avatarURL({dynamic: true})
                                    }
                                })],
                            })
                        }
                    }
                    else if (i.values[0] === "cbanner") {
                        let quest = await i.channel.send({content: "Quel est la nouvelle banniere du bot?"})
                        let rep = await i.channel.awaitMessages({filter: m => m.author.id == i.user.id, max: 1, time: 30_000})
                        const bot = new banner(client)
                        if (rep.first()) {
                            if (rep.first().content.startsWith("https://")) {
                                quest.delete()
                                let newBanner = rep.first().content
                                client.user.banner = newBanner;
                                bot.setBanner(newBanner)
                                msg.edit({
                                    content: null,
                                    embeds: [new EmbedBuilder({
                                        title: client.user.username + " " + "Custom Panel",
                                        color: color,
                                        footer: client.config.footer,
                                        timestamp: new Date(),
                                        fields: [
                                            {name: "Nom du bot", value: client.user.username},
                                            {name: "Status du bot", value: `${client.presence.status}`},
                                            {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                        ],
                                        image: {
                                            url: client.user.avatarURL({dynamic: true})
                                        },
                                        thumbnail: {
                                            url: client.user.banner
                                        }
                                    })],
                                })
                            }
                        } else {
                            quest.delete()
                            client.user.banner = rep.first().attachments.first().url;
                            bot.setBanner(rep.first().attachments.first().url)
                                msg.edit({
                                    content: null,
                                    embeds: [new EmbedBuilder({
                                        title: client.user.username + " " + "Custom Panel",
                                        color: color,
                                        footer: client.config.footer,
                                        timestamp: new Date(),
                                        fields: [
                                            {name: "Nom du bot", value: client.user.username},
                                            {name: "Status du bot", value: `${client.presence.status}`},
                                            {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                        ],
                                        image: {
                                            url: client.user.avatarURL({dynamic: true})
                                        },
                                        thumbnail: {
                                            url: client.user.banner
                                        }
                                    })],
                                })
                            

                        }
                    }
                    else if (i.values[0] === "cstatus") {
                        msg.edit({
                            content: null,
                            embeds: [new EmbedBuilder({
                                title: client.user.username + " " + "Custom Panel",
                                thumbnail: {
                                    url: client.user.banner
                                },
                                color: color,
                                footer: client.config.footer,
                                timestamp: new Date(),
                                fields: [
                                    {name: "Nom du bot", value: client.user.username},
                                    {name: "Status du bot", value: `${client.presence.status}`},
                                    {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                ],
                                image: {
                                    url: client.user.avatarURL({dynamic: true})
                                }
                            })],
                            components: [{
                                type: 1,
                                components: [{
                                    type: 3,
                                    custom_id: "botcs" + msg.id,
                                    options: [{
                                        label: "Online",
                                        value: "online",
                                        emoji: "🟢"
                                    }, {
                                        label: "Idle",
                                        value: "idle",
                                        emoji: "🟡"
                                    }, {
                                        label: "Dnd",
                                        value: "dnd",
                                        emoji: "🔴"
                                    }, {
                                        label: "Invisible",
                                        value: "invisible",
                                        emoji: "⚫"
                                    },{
                                        label: "Annuler",
                                        value: "cancel",
                                        emoji: "❌"
                                    }]
                                }]
                            }]
                        })
                    }
                    else if (i.values[0] === "cactivity") {
                        msg.edit({
                            content: null,
                            embeds: [new EmbedBuilder({
                                title: client.user.username + " " + "Custom Panel",
                               
                                color: color,
                                footer: client.config.footer,
                                timestamp: new Date(),
                                fields: [
                                    {name: "Nom du bot", value: client.user.username},
                                    {name: "Status du bot", value: `${client.presence.status}`},
                                    {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                ],
                                image: {
                                    url: client.user.avatarURL({dynamic: true})
                                }
                            })],
                            components: [{
                                type: 1,
                                components: [{
                                    type: 3,
                                    custom_id: "botms" + msg.id,
                                    options: [{
                                        label: "Joue à",
                                        value: "playing",
                                        emoji: "1️⃣"
                                    }, {
                                        label: "Regarde",
                                        value: "watching",
                                        emoji: "2️⃣"
                                    }, {
                                        label: "Ecoute",
                                        value: "listen",
                                        emoji: "3️⃣"
                                    }, {
                                        label: "Stream",
                                        value: "stream",
                                        emoji: "4️⃣"
                                    }]
                                }]
                            }, {
                                type: 1,
                                components: [{
                                    type: 3,
                                    custom_id: "botms2" + msg.id,
                                    options: [ {
                                        label: "Participe",
                                        value: "compet",
                                        emoji: "5️⃣"
                                    },{
                                        label: 'Custom',
                                        value: 'custom',
                                        emoji: '6️⃣'
                                    },{
                                        label: "Annuler",
                                        value: "cancel",
                                        emoji: "❌"
                                    }]
                                }]
                            }]
                        })
                    }  
                    else if (i.values[0] === "cavatar") {
                        let quest = await i.channel.send({content: "Quel est le nouvel avatar du bot?"})
                        let rep = await i.channel.awaitMessages({filter: m => m.author.id == i.user.id, max: 1, time: 30_000})
                        if (rep.first()) {
                            // check si l avatar provient d un lien discord ou d un fichier 
                            if (rep.first().content.startsWith("https://")) {
                                quest.delete()
                                client.user.avatar = rep.first().content
                                client.user.setAvatar(rep.first().content)
                                rep.first().delete()
                                msg.edit({
                                    content: null,
                                    embeds: [new EmbedBuilder({
                                        title: client.user.username + " " + "Custom Panel",
                                         thumbnail: {
                                            url: ''
                                        },
                                        color: color,
                                        footer: client.config.footer,
                                        timestamp: new Date(),
                                        fields: [
                                            {name: "Nom du bot", value: client.user.username},
                                            {name: "Status du bot", value: `${client.presence.status}`},
                                            {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                        ],
                                        image: {
                                            url: client.user.avatar
                                        }
                                    })],
                                })
                            }
                            else {
                                quest.delete()
                                client.user.avatar = rep.first().attachments.first().url
                                client.user.setAvatar(rep.first().attachments.first().url)
                                rep.first().delete()
                                msg.edit({
                                    content: null,
                                    embeds: [new EmbedBuilder({
                                        title: client.user.username + " " + "Custom Panel",
                                         thumbnail: {
                                            url: ''
                                        },
                                        color: color,
                                        footer: client.config.footer,
                                        timestamp: new Date(),
                                        fields: [
                                            {name: "Nom du bot", value: client.user.username},
                                            {name: "Status du bot", value: `${client.presence.status}`},
                                            {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                        ],
                                        image: {
                                            url: client.user.avatar
                                        }
                                    })],
                                })
                            }
                        }
                    }
                }
                if (i.customId === "botms2" + msg.id) {
                    if (i.values[0] === "cancel") {
                        msg.edit({
                            content: null,
                            embeds: [new EmbedBuilder({
                                title: client.user.username + " " + "Custom Panel",
                                 thumbnail: {
                                            url: ''
                                        },
                                color: color,
                                footer: client.config.footer,
                                timestamp: new Date(),
                                fields: [
                                    {name: "Nom du bot", value: client.user.username},
                                    {name: "Status du bot", value: `${client.presence.status}`},
                                    {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                ],
                                image: {
                                    url: client.user.avatarURL({dynamic: true})
                                }
                            })
                            ],
                            components: [{
                                type: 1,
                                components: [{
                                    type: 3,
                                    custom_id: "botm" + msg.id,
                                    options: [{
                                        label: "Modifier le nom du bot",
                                        value: "cname",
                                        emoji: "1️⃣"
                                    }, {
                                        label: "Modifier le status du bot",
                                        value: "cstatus",
                                        emoji: "2️⃣"
                                    }, {
                                        label: "Modifier l'activité du bot",
                                        value: "cactivity",
                                        emoji: "3️⃣"
                                    },{
                                        label: "Modifier l'avatar du bot",
                                        value: "cavatar",
                                        emoji: "4️⃣"
                                    }, {
                                        label: "Modifier la banniere du bot",
                                        value: "cbanner",
                                        emoji: "5️⃣"
                                    },{
                                        label: "Annuler",
                                        value: "cancel",
                                        emoji: "❌"
                                    }]
                                }]
                            }]
                        })
                    }


                    if(i.values[0] === 'custom') {
                        let quest = await i.channel.send({content: "Quel est la nouvelle activité du bot?"})
                        let rep = await i.channel.awaitMessages({filter: m => m.author.id == i.user.id, max: 1, time: 30_000})
                        if (rep.first()) {
                            quest.delete()
                            client.user.setPresence({activities: [{name: rep.first().content, type: 4}]});
                            rep.first().delete()
                            msg.edit({
                                content: null,
                                embeds: [new EmbedBuilder({
                                    title: client.user.username + " " + "Custom Panel",
                                     thumbnail: {
                                            url: ''
                                        },
                                    color: color,
                                    footer: client.config.footer,
                                    timestamp: new Date(),
                                    fields: [
                                        {name: "Nom du bot", value: client.user.username},
                                        {name: "Status du bot", value: `${client.presence.status}`},
                                        {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                    ],
                                    image: {
                                        url: client.user.avatarURL({dynamic: true})
                                    }
                                })],
                            })


                            // await client.db.none(`UPDATE clarity_${client.user.id}_bot_status SET type = \$1, status = \$2`, ['custom', rep.first().content]);

                            let db = client.data2.get(`${client.user.id}_bot_status`) || {
                                type: 'custom',
                                status: `Clarity ${client.version.version}`,
                                presence: 'dnd',
                                url: "tsubasa_poulpy"
                            }
                            db.type = 'custom';
                            db.status = rep.first().content;
                            client.data2.set(`${client.user.id}_bot_status`, db);
                        }
                    }

                    if (i.values[0] === "compet") {
                        let quest = await i.channel.send({content: "Quel est la nouvelle activité du bot?"})
                        let rep = await i.channel.awaitMessages({filter: m => m.author.id == i.user.id, max: 1, time: 30_000})
                        if (rep.first()) {
                            quest.delete()
                            client.user.setPresence({activities: [{name: rep.first().content, type: 5}]});
                            rep.first().delete()
                            msg.edit({
                                content: null,
                                embeds: [new EmbedBuilder({
                                    title: client.user.username + " " + "Custom Panel",
                                     thumbnail: {
                                            url: ''
                                        },
                                    color: color,
                                    footer: client.config.footer,
                                    timestamp: new Date(),
                                    fields: [
                                        {name: "Nom du bot", value: client.user.username},
                                        {name: "Status du bot", value: `${client.presence.status}`},
                                        {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                    ],
                                    image: {
                                        url: client.user.avatarURL({dynamic: true})
                                    }
                                })],
                            })
                            // await client.db.none(`UPDATE clarity_${client.user.id}_bot_status SET type = \$1, status = \$2`, ['compet', rep.first().content]);

                            let db = client.data2.get(`${client.user.id}_bot_status`) || {
                                type: 'custom',
                                status: `Clarity ${client.version.version}`,
                                presence: 'dnd',
                                url: "tsubasa_poulpy"
                            }
                            db.type = 'compet';
                            db.status = rep.first().content;
                            client.data2.set(`${client.user.id}_bot_status`, db);
                        }
                    }

                }
                if (i.customId === "botms" + msg.id) {

                    if (i.values[0] === "playing") {
                       let quest = await i.channel.send({content: "Quel est la nouvelle activité du bot?"})
                       let rep = await i.channel.awaitMessages({filter: m => m.author.id == i.user.id, max: 1, time: 30_000})
                       if (rep.first()) {
                           quest.delete()
                           client.user.setPresence({activities: [{name: rep.first().content, type: 0}]});
                           rep.first().delete()
                           msg.edit({
                               content: null,
                               embeds: [new EmbedBuilder({
                                   title: client.user.username + " " + "Custom Panel",
                                    thumbnail: {
                                            url: ''
                                        },
                                   color: color,
                                   footer: client.config.footer,
                                   timestamp: new Date(),
                                   fields: [
                                       {name: "Nom du bot", value: client.user.username},
                                       {name: "Status du bot", value: `${client.presence.status}`},
                                       {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                   ],
                                   image: {
                                       url: client.user.avatarURL({dynamic: true})
                                   }
                               })],
                           })
                           // await client.db.none(`UPDATE clarity_${client.user.id}_bot_status SET type = \$1, status = \$2`, ['play', rep.first().content]);

                                let db = client.data2.get(`${client.user.id}_bot_status`) || {
                                    type: 'custom',
                                    status: `Clarity ${client.version.version}`,
                                    presence: 'dnd',
                                    url: "tsubasa_poulpy"
                                }
                                db.type = 'play';
                                db.status = rep.first().content;
                                client.data2.set(`${client.user.id}_bot_status`, db);
                       }
                    }
                    if (i.values[0] === "watching") {
                       let quest = await i.channel.send({content: "Quel est la nouvelle activité du bot?"})
                       let rep = await i.channel.awaitMessages({filter: m => m.author.id == i.user.id, max: 1, time: 30_000})
                       if (rep.first()) {
                           quest.delete()
                           client.user.setPresence({activities: [{name: rep.first().content, type: 3}]});
                           rep.first().delete()
                           msg.edit({
                               content: null,
                               embeds: [new EmbedBuilder({
                                   title: client.user.username + " " + "Custom Panel",
                                    thumbnail: {
                                            url: ''
                                        },
                                   color: color,
                                   footer: client.config.footer,
                                   timestamp: new Date(),
                                   fields: [
                                       {name: "Nom du bot", value: client.user.username},
                                       {name: "Status du bot", value: `${client.presence.status}`},
                                       {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                   ],
                                   image: {
                                       url: client.user.avatarURL({dynamic: true})
                                   }
                               })],
                           })
                           // await client.db.none(`UPDATE clarity_${client.user.id}_bot_status SET type = \$1, status = \$2`, ['watch', rep.first().content]);
                           let db = client.data2.get(`${client.user.id}_bot_status`) || {
                               type: 'custom',
                               status: `Clarity ${client.version.version}`,
                               presence: 'dnd',
                               url: "tsubasa_poulpy"
                           }
                            db.type = 'watch';
                            db.status = rep.first().content;
                            client.data2.set(`${client.user.id}_bot_status`, db);
                       }
                    }
                    if (i.values[0] === "listen") {
                       let quest = await i.channel.send({content: "Quel est la nouvelle activité du bot?"})
                       let rep = await i.channel.awaitMessages({filter: m => m.author.id == i.user.id, max: 1, time: 30_000})
                       if (rep.first()) {
                           quest.delete()
                           client.user.setPresence({activities: [{name: rep.first().content, type: 2}]});
                           rep.first().delete()
                           msg.edit({
                               content: null,
                               embeds: [new EmbedBuilder({
                                   title: client.user.username + " " + "Custom Panel",
                                    thumbnail: {
                                            url: ''
                                        },
                                   color: color,
                                   footer: client.config.footer,
                                   timestamp: new Date(),
                                   fields: [
                                       {name: "Nom du bot", value: client.user.username},
                                       {name: "Status du bot", value: `${client.presence.status}`},
                                       {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                   ],
                                   image: {
                                       url: client.user.avatarURL({dynamic: true})
                                   }
                               })],
                           })
                           // await client.db.none(`UPDATE clarity_${client.user.id}_bot_status SET type = \$1, status = \$2`, ['listen', rep.first().content]);

                            let db = client.data2.get(`${client.user.id}_bot_status`) || {
                                 type: 'custom',
                                 status: `Clarity ${client.version.version}`,
                                 presence: 'dnd',
                                 url: "tsubasa_poulpy"
                            }
                             db.type = 'listen';
                             db.status = rep.first().content;
                             client.data2.set(`${client.user.id}_bot_status`, db);
                       }
                    }

                    if (i.values[0] === "stream") {
                        let quest = await i.channel.send({content: "Quel est la nouvelle activité du bot?"});
                        let rep = await i.channel.awaitMessages({filter: m => m.author.id == i.user.id, max:  1, time:  30_000});
                        if (rep.first()) {
                            quest.delete();
                            rep.first().delete();
                            // Editing the message with the new bot activity
                            msg.edit({
                                content: null,
                                embeds: [new EmbedBuilder({
                                    title: client.user.username + " " + "Custom Panel",
                                    color: color,
                                    footer: client.config.footer,
                                    timestamp: new Date(),
                                    fields: [
                                        {name: "Nom du bot", value: client.user.username},
                                        {name: "Status du bot", value: `${client.presence.status}`},
                                        {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                    ],
                                    image: {
                                        url: client.user.avatarURL({dynamic: true})
                                    }
                                })],
                            });

                            // Second part of your script
                            let quest2 = await i.channel.send({content: "Quel est le lien de la chaine?"});
                            let rep2 = await i.channel.awaitMessages({filter: m => m.author.id == i.user.id, max:  1, time:  30_000});
                            if (rep2.first()) {
                                quest2.delete();
                                rep2.first().delete();

                                // Validate the URL before saving
                                const url = rep2.first().content;
                                if (!url.startsWith('http://') && !url.startsWith('https://')) {
                                    return i.channel.send('Format d\'URL invalide. Veuillez fournir une URL valide commençant par http:// ou https://');
                                }

                                // Editing the message with the new bot status and URL
                                msg.edit({
                                    content: null,
                                    embeds: [new EmbedBuilder({
                                        title: client.user.username + " " + "Custom Panel",
                                        color: color,
                                        footer: client.config.footer,
                                        timestamp: new Date(),
                                        fields: [
                                            {name: "Nom du bot", value: client.user.username},
                                            {name: "Status du bot", value: `${client.presence.status}`},
                                            {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                        ],
                                        image: {
                                            url: client.user.avatarURL({dynamic: true})
                                        }
                                    })],
                                });

                                // Save the URL in the database
                                // await client.db.none(`UPDATE clarity_${client.user.id}_bot_status SET type = \$1, status = \$2, url = \$3`, ['stream', rep.first().content, url]);
                                let db = client.data2.get(`${client.user.id}_bot_status`) || {
                                    type: 'custom',
                                    status: `Clarity ${client.version.version}`,
                                    presence: 'dnd',
                                    url: "tsubasa_poulpy"
                                }
                                db.type = 'stream';
                                db.status = rep.first().content;
                                db.url = url;
                                client.data2.set(`${client.user.id}_bot_status`, db);
                                client.user.setPresence({activities: [{name: rep.first().content, type:  1, url: url}], status: 'dnd'});
                           }
                       }
                    //    pose une question pour le lien de la chaine

                    }

                }
                if (i.customId === "botcs" + msg.id) {
                    if (i.values[0] === "cancel") {
                        msg.edit({
                            content: null,
                            embeds: [new EmbedBuilder({
                                title: client.user.username + " " + "Custom Panel",
                                 thumbnail: {
                                            url: ''
                                        },
                                color: color,
                                footer: client.config.footer,
                                timestamp: new Date(),
                                fields: [
                                    {name: "Nom du bot", value: client.user.username},
                                    {name: "Status du bot", value: `${client.presence.status}`},
                                    {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                ],
                                image: {
                                    url: client.user.avatarURL({dynamic: true})
                                }
                            })
                        ],
                        components: [{
                            type: 1,
                            components: [{
                                type: 3,
                                custom_id: "botm" + msg.id,
                                options: [{
                                    label: "Modifier le nom du bot",
                                    value: "cname",
                                    emoji: "1️⃣"
                                }, {
                                    label: "Modifier le status du bot",
                                    value: "cstatus",
                                    emoji: "2️⃣"
                                }, {
                                    label: "Modifier l'activité du bot",
                                    value: "cactivity",
                                    emoji: "3️⃣"
                                },{
                                    label: "Modifier l'avatar du bot",
                                    value: "cavatar",
                                    emoji: "4️⃣"
                                }, {
                                    label: "Modifier la banniere du bot",
                                    value: "cbanner",
                                    emoji: "5️⃣"
                                },{
                                    label: "Annuler",
                                    value: "cancel",
                                    emoji: "❌"
                                }]
                            }]
                        }]
                        })
                     }
                     else if (i.values[0] === "online") {
                        client.user.setPresence({status: "online"});
                        msg.edit({
                            content: null,
                            embeds: [new EmbedBuilder({
                                title: client.user.username + " " + "Custom Panel",
                                 thumbnail: {
                                            url: ''
                                        },
                                color: color,
                                footer: client.config.footer,
                                timestamp: new Date(),
                                fields: [
                                    {name: "Nom du bot", value: client.user.username},
                                    {name: "Status du bot", value: `${client.presence.status}`},
                                    {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                ],
                                image: {
                                    url: client.user.avatarURL({dynamic: true})
                                }
                            })
                        ]})
                        // await client.db.none(`UPDATE clarity_${client.user.id}_bot_status SET presence`, ['online']);
                        let db = client.data2.get(`${client.user.id}_bot_status`) || {
                            type: 'custom',
                            status: `Clarity ${client.version.version}`,
                            presence: 'dnd',
                            url: "tsubasa_poulpy"
                        }
                        db.presence = 'online';
                        client.data2.set(`${client.user.id}_bot_status`, db);
                     }
                     else if (i.values[0] === "dnd") {
                        client.user.setPresence({status: "dnd"});
                        msg.edit({
                            content: null,
                            embeds: [new EmbedBuilder({
                                title: client.user.username + " " + "Custom Panel",
                                 thumbnail: {
                                            url: ''
                                        },
                                color: color,
                                footer: client.config.footer,
                                timestamp: new Date(),
                                fields: [
                                    {name: "Nom du bot", value: client.user.username},
                                    {name: "Status du bot", value: `${client.presence.status}`},
                                    {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                ],
                                image: {
                                    url: client.user.avatarURL({dynamic: true})
                                }
                            })
                        ]})
                        // await client.db.none(`UPDATE clarity_${client.user.id}_bot_status SET presence`, ['dnd']);
                        let db = client.data2.get(`${client.user.id}_bot_status`) || {
                            type: 'custom',
                            status: `Clarity ${client.version.version}`,
                            presence: 'dnd',
                            url: "tsubasa_poulpy"
                        }
                        db.presence = 'dnd';
                        client.data2.set(`${client.user.id}_bot_status`, db);
                     }
                     else if (i.values[0] === "idle") {
                        client.user.setPresence({status: "idle"});
                        msg.edit({
                            content: null,
                            embeds: [new EmbedBuilder({
                                title: client.user.username + " " + "Custom Panel",
                                 thumbnail: {
                                            url: ''
                                        },
                                color: color,
                                footer: client.config.footer,
                                timestamp: new Date(),
                                fields: [
                                    {name: "Nom du bot", value: client.user.username},
                                    {name: "Status du bot", value: `${client.presence.status}`},
                                    {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                ],
                                image: {
                                    url: client.user.avatarURL({dynamic: true})
                                }
                            })
                        ]})
                        // await client.db.none(`UPDATE clarity_${client.user.id}_bot_status SET presence`, ['idlle']);
                        let db = client.data2.get(`${client.user.id}_bot_status`) || {
                            type: 'custom',
                            status: `Clarity ${client.version.version}`,
                            presence: 'dnd',
                            url: "tsubasa_poulpy"
                        }
                        db.presence = 'idle';
                        client.data2.set(`${client.user.id}_bot_status`, db);
                     }
                     else if (i.values[0] === "invisible") {
                        client.user.setPresence({status: "invisible"});
                        msg.edit({
                            content: null,
                            embeds: [new EmbedBuilder({
                                title: client.user.username + " " + "Custom Panel",
                                 thumbnail: {
                                            url: ''
                                        },
                                color: color,
                                footer: client.config.footer,
                                timestamp: new Date(),
                                fields: [
                                    {name: "Nom du bot", value: client.user.username},
                                    {name: "Status du bot", value: `${client.presence.status}`},
                                    {name: "Activité du bot", value: `${client.presence.activities[0].name}`},
                                ],
                                image: {
                                    url: client.user.avatarURL({dynamic: true})
                                }
                            })
                        ]})
                        // await client.db.none(`UPDATE clarity_${client.user.id}_bot_status SET presence`, ['invisible']);
                        let db = client.data2.get(`${client.user.id}_bot_status`) || {
                            type: 'custom',
                            status: `Clarity ${client.version.version}`,
                            presence: 'dnd',
                            url: "tsubasa_poulpy"
                        }
                        db.presence = 'invisible';
                        client.data2.set(`${client.user.id}_bot_status`, db);
                     }
                }
            })
        }