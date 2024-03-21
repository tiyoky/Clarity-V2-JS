const { EmbedBuilder ,ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder , ChannelSelectMenuBuilder , RoleSelectMenuBuilder , UserSelectMenuBuilder} = require("discord.js");

module.exports = {
    name: "antichannel",
    run: async(client, message, args) => {
        const isOwn = await client.db.oneOrNone(`SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`, [message.author.id]);
        if (!isOwn) return message.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande" });

        let data = client.antiraid.get(`secur_${message.guild.id}`) || {
            antichannel: {
                status: false,
                ignored_role: [],
                ignored_user: [],
                sanction: "mute",
                sanction_admin: "derank",
                rep: false,
                rep_limit: 5,
                logs: null,
                logs_status: false,
                link: "all"
            }
        }

        if (!data.antichannel) {
            data.antichannel = {
                status: false,
                ignored_role: [],
                ignored_user: [],
                sanction: "mute",
                sanction_admin: "derank",
                rep: false,
                rep_limit: 5,
                logs: null,
                logs_status: false
            };
        }

        if (!args[0]) return message.reply({ content: `Merci de préciser une option : \`antichannel <on/off/max/allow/sanction/limit/logs/panel>\`` });
        if (args[0] === "on") {
            data.antichannel.status = true;
            client.antiraid.set(`secur_${message.guild.id}`, data);
            return message.reply({ content: "L'antichannel est activé" });
        }
        else if (args[0] === "off") {
            data.antichannel.status = false;
            client.antiraid.set(`secur_${message.guild.id}`, data);
            return message.reply({ content: "L'antichannel est désactivé" });
        }
        else if (args[0] === "allow") {

            let row = new ActionRowBuilder().addComponents(new UserSelectMenuBuilder().setCustomId("allow_user" + message.id).setPlaceholder("Sélectionner un utilisateur"))
            let row2 = new ActionRowBuilder().addComponents(new RoleSelectMenuBuilder().setCustomId("allow_role" + message.id).setPlaceholder("Sélectionner un rôle"))

            await message.reply({ components: [row, row2] })
            const collector = message.channel.createMessageComponentCollector({ filter: i => i.user.id === message.author.id, time: 1500000 })

            collector.on('collect', async (i) => {
                if (i.customId === "allow_user" + message.id) {
                    data.antichannel.ignored_user.push(i.values[0]);
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    await i.update({ content: "Utilisateur ajouté à la liste des ignorés" })
                }
                if (i.customId === "allow_role" + message.id) {
                    data.antichannel.ignored_role.push(i.values[0]);
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    await i.update({ content: "Rôle ajouté à la liste des ignorés" })
                }
            })
        }

        else if (args[0] === "sanction") {
            let menu = new StringSelectMenuBuilder()
                .setCustomId("antichannel" + message.id)
                .setPlaceholder("Sélectionner une sanction")
                .addOptions(["mute", "kick", "ban", "derank", "warn"].map(s => { return { label: s, value: s } }))

                let menu2 = new StringSelectMenuBuilder()
                .setCustomId("antichannel2" + message.id)
                .setPlaceholder("Sélectionner une sanction pour les permissions d'administrateurs")
                .addOptions([ "kick", "ban", "derank"].map(s => { return { label: s, value: s } }))
            
            let row = new ActionRowBuilder().addComponents(menu, menu2)
            await message.reply({ components: [row] })

            const collector = message.channel.createMessageComponentCollector({ filter: i => i.user.id === message.author.id, time: 1500000 })

            collector.on('collect', async (i) => {
                if (i.customId === "antichannel" + message.id) {
                    data.antichannel.sanction = i.values[0];
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    return i.reply({
                        content: `La sanction a été changée pour \`${i.values[0]}\``,
                        ephemeral: true
                    });
                }
                if (i.customId === "antichannel2" + message.id) {
                    data.antichannel.sanction_admin = i.values[0];
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    return i.reply({
                        content: `La sanction pour les administrateurs a été changée pour \`${i.values[0]}\``,
                        ephemeral: true
                    });
                }
            })
        }

        else if (args[0] === "logs") {
            let row = new ActionRowBuilder().addComponents(new ChannelSelectMenuBuilder().setCustomId("antichannel8" + message.id).setPlaceholder("Sélectionner un channel").setMaxValues(1))
            await message.reply({ components: [row] })

            const filter = (i) => i.user.id === message.author.id
            const collector = message.channel.createMessageComponentCollector({ filter, time: 1500000 })

            collector.on('collect', async (i) => {
                data.antichannel.logs = i.values[0];
                client.antiraid.set(`secur_${message.guild.id}`, data);
                await i.reply({ content: "Logs configurés", ephemeral: true })
            })
        }

        else if (args[0] === "max") {
            data.antichannel.status = true;
            data.antichannel.ignored_role = [];
            data.antichannel.ignored_user = [];
            data.antichannel.sanction = "mute";
            data.antichannel.logs = null;
            data.antichannel.logs_status = true;
            client.antiraid.set(`secur_${message.guild.id}`, data);
            return message.reply({ content: "L'antichannel est configuré pour protéger au maximum" });
        }

        else if (args[0] === 'panel') {
            let embed = new EmbedBuilder()
                .setTitle(message.guild.name + " - Module de sécurité")
                .setColor(parseInt(client.color.replace("#", ""), 16))
                .setDescription("Configuration du module de sécurité")
                .addFields(
                {
                    name: "Statut",
                    value: data.antichannel.status ? "<:Poulpyactif:1216368664773660692>" : "<:poulpynepasderanger:1216368662554869832>"
                }, {
                    name: "Ignorer les rôles",
                    value: data.antichannel.ignored_role.length > 0 ? data.antichannel.ignored_role.map(r => `<@&${r}>`).join(", ") : "Aucun"
                }, {
                    name: "Ignorer les utilisateurs",
                    value: data.antichannel.ignored_user.length > 0 ? data.antichannel.ignored_user.map(u => `<@${u}>`).join(", ") : "Aucun"
                }, {
                    name: "Sanction",
                    value: data.antichannel.sanction
                },
                {
                    name: "Logs",
                    value: data.antichannel.logs_status ? "<:Poulpyactif:1216368664773660692>" : "<:poulpynepasderanger:1216368662554869832>"
                })
                .setFooter({
                    text: client.config.footer.text
                })

            let menu1 = new StringSelectMenuBuilder()
                .setCustomId("antichannel" + message.id)
                .setPlaceholder("Sélectionner une option")
                .addOptions([
                    {
                        label: "Statut",
                        value: "status",
                        emoji: data.antichannel.status ? "<:Poulpyactif:1216368664773660692>" : "<:poulpynepasderanger:1216368662554869832>"
                    },
                    {
                        label: "Ignorer les rôles",
                        value: "ignored_role"
                    }, 
                    {
                        label: "Ignorer les utilisateurs",
                        value: "ignored_user"
                    }
                ])

            let menu2 = new StringSelectMenuBuilder()
                .setCustomId("antichannel2" + message.id)
                .setPlaceholder("Sélectionner une option")
                .addOptions([
                    {
                        label: "Sanction",
                        value: "sanction"
                    },
                    {
                        label: "Logs",
                        value: "logs",
                        emoji: data.antichannel.logs_status ? "<:Poulpyactif:1216368664773660692>" : "<:poulpynepasderanger:1216368662554869832>"
                    }
                ])

            let row = new ActionRowBuilder().addComponents(menu1)
            let row2 = new ActionRowBuilder().addComponents(menu2)

            let msg = await message.channel.send({ embeds: [embed], components: [row, row2] })
            const collector = message.channel.createMessageComponentCollector({ filter: (i) => i.user.id === message.author.id, time: 1500000 })

            collector.on('collect', async (i) => {
                if (i.customId === "antichannel" + message.id) {
                    if (i.values[0] === "status") {
                        data.antichannel.status = data.antichannel.status ? false : true;
                        client.antiraid.set(`secur_${message.guild.id}`, data);
                        embed.fields[0].value = data.antichannel.status ? "<:Poulpyactif:1216368664773660692>" : "<:poulpynepasderanger:1216368662554869832>";
                        await i.update({ embeds: [embed], components: [row, row2] })
                    }
                    if (i.values[0] === "ignored_channel") {
                        let menu = new ChannelSelectMenuBuilder()
                            .setCustomId("antichannel3" + message.id)
                            .setPlaceholder("Sélectionner un channel")
                            .addOptions(message.guild.channels.cache.filter(ch => ch.type !== 4).map(ch => {
                                return {
                                    label: ch.name,
                                    value: ch.id
                                }
                            }))
                        let row = new ActionRowBuilder()
                            .addComponents(menu)
                        await i.update({ embeds: [embed], components: [row] })
                    }
                    if (i.values[0] === "ignored_role") {
                        let menu = new RoleSelectMenuBuilder()
                            .setCustomId("antichannel4" + message.id)
                            .setPlaceholder("Sélectionner un rôle")
                            .addOptions(message.guild.roles.cache.map(r => {
                                return {
                                    label: r.name,
                                    value: r.id
                                }
                            }))
                        let row = new ActionRowBuilder()
                            .addComponents(menu)
                        await i.update({ embeds: [embed], components: [row] })
                    }
                    if (i.values[0] === "ignored_user") {
                        let menu = new UserSelectMenuBuilder()
                            .setCustomId("antichannel5" + message.id)
                            .setPlaceholder("Sélectionner un utilisateur")
                            .addOptions(message.guild.members.cache.map(u => {
                                return {
                                    label: u.user.username,
                                    value: u.id
                                }
                            }))
                        let row = new ActionRowBuilder()
                            .addComponents(menu)
                        await i.update({ embeds: [embed], components: [row] })
                    }
                }
                if (i.customId === "antichannel2" + message.id) {
                    if (i.values[0] === "sanction") {
                        let menu = new StringSelectMenuBuilder()
                            .setCustomId("antichannel6" + message.id)
                            .setPlaceholder("Sélectionner une sanction")
                            .addOptions(["mute", "kick", "ban", "derank", "warn"].map(s => {
                                return {
                                    label: s,
                                    value: s
                                }
                            }))
                        let row = new ActionRowBuilder()
                            .addComponents(menu)
                        await i.update({embeds: [embed], components: [row]})
                    }
                    if (i.values[0] === "rep") {
                        data.antichannel.rep = !data.antichannel.rep;
                        client.antiraid.set(`secur_${message.guild.id}`, data);
                        embed.fields[5].value = data.antichannel.rep ? "<:Poulpyactif:1216368664773660692>" : "<:poulpynepasderanger:1216368662554869832>";
                        await i.update({ embeds: [embed], components: [row, row2] })
                    }
                    if (i.values[0] === "rep_limit") {
                        let menu = new StringSelectMenuBuilder()
                            .setCustomId("antichannel7" + message.id)
                            .setPlaceholder("Sélectionner une limite")
                            .addOptions([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(l => {
                                return {
                                    label: l,
                                    value: l
                                }
                            }))
                        let row = new ActionRowBuilder()
                            .addComponents(menu)
                        await i.update({embeds: [embed], components: [row]})
                    }
                    if (i.values[0] === "logs") {

                        let menu = new ChannelSelectMenuBuilder()
                            .setCustomId("antichannel8" + message.id)
                            .setPlaceholder("Sélectionner un channel")
                            .addOptions(message.guild.channels.cache.filter(ch => ch.type !== 4).map(ch => {
                                return {
                                    label: ch.name,
                                    value: ch.id
                                }
                            }))
                        let row = new ActionRowBuilder()
                            .addComponents(menu)
                        await i.update({embeds: [embed], components: [row]})
                    }
                    if (i.values[0] === "link") {
                        let menu = new StringSelectMenuBuilder()
                            .setCustomId("antichannel9" + message.id)
                            .setPlaceholder("Sélectionner un type de lien")
                            .addOptions(["all", "discord", "http"].map(l => {
                                return {
                                    label: l,
                                    value: l
                                }
                            }))
                        let row = new ActionRowBuilder()
                            .addComponents(menu)
                        await i.update({embeds: [embed], components: [row]})
                    }
                }

                if (i.customId === "antichannel3" + message.id) {
                    data.antichannel.ignored_channel.push(i.values[0]);
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    embed.fields[1].value = data.antichannel.ignored_channel.length > 0 ? data.antichannel.ignored_channel.map(c => `<#${c}>`).join(", ") : "Aucun";
                    await i.update({ embeds: [embed], components: [row, row2] })
                }

                if (i.customId === "antichannel4" + message.id) {
                    data.antichannel.ignored_role.push(i.values[0]);
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    embed.fields[2].value = data.antichannel.ignored_role.length > 0 ? data.antichannel.ignored_role.map(r => `<@&${r}>`).join(", ") : "Aucun";
                    await i.update({ embeds: [embed], components: [row, row2] })
                }

                if (i.customId === "antichannel5" + message.id) {
                    data.antichannel.ignored_user.push(i.values[0]);
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    embed.fields[3].value = data.antichannel.ignored_user.length > 0 ? data.antichannel.ignored_user.map(u => `<@${u}>`).join(", ") : "Aucun";
                    await i.update({ embeds: [embed], components: [row, row2] })
                }

                if (i.customId === "antichannel6" + message.id) {
                    data.antichannel.sanction = i.values[0];
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    embed.fields[4].value = data.antichannel.sanction;
                    await i.update({ embeds: [embed], components: [row, row2] })
                }

                if (i.customId === "antichannel7" + message.id) {
                    data.antichannel.rep_limit = i.values[0];
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    embed.fields[6].value = data.antichannel.rep_limit;
                    await i.update({ embeds: [embed], components: [row, row2] })
                }

                if (i.customId === "antichannel8" + message.id) {
                    data.antichannel.logs = i.values[0];
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    embed.fields[8].value = data.antichannel.logs_status ? "<:Poulpyactif:1216368664773660692>" : "<:poulpynepasderanger:1216368662554869832>";
                    await i.update({ embeds: [embed], components: [row, row2] })
                }

                if (i.customId === "antichannel9" + message.id) {
                    data.antichannel.link = i.values[0];
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    embed.fields[9].value = data.antichannel.link;
                    await i.update({ embeds: [embed], components: [row, row2] })
                }
            })
        }
    }
}