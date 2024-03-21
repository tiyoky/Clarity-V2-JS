const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ChannelSelectMenuBuilder, RoleSelectMenuBuilder, UserSelectMenuBuilder } = require("discord.js");

module.exports = {
    name: "antilink",
    description: "Configure l'antilink",
    run: async (client, message, args) => {
        const isOwn = await client.db.oneOrNone(
            `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
            [message.author.id]
        );
        if (!isOwn) {
            return message.reply({
                content: "Vous n'avez pas la permission d'utiliser cette commande",
            });
        }

        let data = client.antiraid.get(`secur_${message.guild.id}`) || {
            antilink: {
                status: false,
                ignored_channel: [],
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

        if (!data.antilink) {
            data.antilink = {
                status: false,
                ignored_channel: [],
                ignored_role: [],
                ignored_user: [],
                sanction: "mute",
                sanction_admin: "derank",
                rep: false,
                rep_limit: 5,
                logs: null,
                logs_status: false,
                link: "all"
            };
        }
        if (!args[0]) {
            return message.reply({
                content: `Merci de préciser une option : \`antilink <on/off/max/allow/sanction/limit/logs/panel>\``,
            });
        }

        if (args[0] === "on") {
            data.antilink.status = true;
            client.antiraid.set(`secur_${message.guild.id}`, data);
            return message.reply({
                content: "L'antilink est activé",
            });
        }

        if (args[0] === "off") {
            data.antilink.status = false;
            client.antiraid.set(`secur_${message.guild.id}`, data);
            return message.reply({
                content: "L'antilink est désactivé",
            });
        }

        if (args[0] === "allow") {
            let allow_user = new UserSelectMenuBuilder()
                .setCustomId("allow_user" + message.id)
                .setPlaceholder("Sélectionner un utilisateur")

            let allow_role = new RoleSelectMenuBuilder()
                .setCustomId("allow_role" + message.id)
                .setPlaceholder("Sélectionner un rôle")

            let allow_channel = new ChannelSelectMenuBuilder()
                .setCustomId("allow_channel" + message.id)
                .setPlaceholder("Sélectionner un channel")

            let row = new ActionRowBuilder()
                .addComponents(allow_user)

            let row2 = new ActionRowBuilder()
                .addComponents(allow_role)

            let row3 = new ActionRowBuilder()
                .addComponents(allow_channel)

            await message.reply(
                {
                    components: [row, row2, row3],
                    flags: 64
                }
            )

            const filter = (i) => i.user.id === message.author.id
            const collector = message.channel.createMessageComponentCollector({ filter, time: 1500000 })

            collector.on('collect', async (i) => {
                if (i.customId === "allow_user" + message.id) {
                    data.antilink.ignored_user.push(i.values[0]);
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    await i.update({ content: "Utilisateur ajouté à la liste des ignorés" })
                }
                if (i.customId === "allow_role" + message.id) {
                    data.antilink.ignored_role.push(i.values[0]);
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    await i.update({ content: "Rôle ajouté à la liste des ignorés" })
                }
                if (i.customId === "allow_channel" + message.id) {
                    data.antilink.ignored_channel.push(i.values[0]);
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    await i.update({ content: "Channel ajouté à la liste des ignorés" })
                }
            })
        }

        if (args[0] === "sanction") {
            let menu = new StringSelectMenuBuilder()
                .setCustomId("antilink6" + message.id)
                .setPlaceholder("Sélectionner une sanction")
                .addOptions(["mute", "kick", "ban", "derank", "warn"].map(s => {
                    return {
                        label: s,
                        value: s
                    }
                }))

            let menu2 = new StringSelectMenuBuilder()
                .setCustomId("antilink7" + message.id)
                .setPlaceholder("Sélectionner une sanction pour les administrateurs")
                .addOptions(["kick", "ban", "derank"].map(s => {
                    return {
                        label: s,
                        value: s
                    }
                }))

            let row = new ActionRowBuilder()
                .addComponents(menu)

            let row2 = new ActionRowBuilder()
                .addComponents(menu2)
            await message.reply({
                components: [row],
                flags: 64
            })

            const filter = (i) => i.user.id === message.author.id
            const collector = message.channel.createMessageComponentCollector({ filter, time: 1500000 })

            collector.on('collect', async (i) => {
                if (i.customId === "antilink6" + message.id) {
                    data.antilink.sanction = i.values[0];
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    return i.reply({
                        content: `La sanction a été changée pour \`${i.values[0]}\``,
                        ephemeral: true
                    });
                }
                if (i.customId === "antilink7" + message.id) {
                    data.antilink.sanction_admin = i.values[0];
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    return i.reply({
                        content: `La sanction pour les administrateurs a été changée pour \`${i.values[0]}\``,
                        ephemeral: true
                    });
                }
            })
        }

        if (args[0] === "limit") {
            let menu = new StringSelectMenuBuilder()
                .setCustomId("antilink7" + message.id)
                .setPlaceholder("Sélectionner une limite")
                .addOptions([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(l => {
                    return {
                        label: l,
                        value: l
                    }
                }))
            let row = new ActionRowBuilder()
                .addComponents(menu)
            await message.reply({
                components: [row],
                flags: 64
            })

            const filter = (i) => i.user.id === message.author.id
            const collector = message.channel.createMessageComponentCollector({ filter, time: 1500000 })

            collector.on('collect', async (i) => {
                data.antilink.rep_limit = i.values[0];
                client.antiraid.set(`secur_${message.guild.id}`, data);
                await i.update({ content: "Limite configurée" })
            })
        }

        if (args[0] === "logs") {
            let menu = new ChannelSelectMenuBuilder()
                .setCustomId("antilink8" + message.id)
                .setPlaceholder("Sélectionner un channel")


            let row = new ActionRowBuilder()
                .addComponents(menu)
            await message.reply({
                components: [row],
                flags: 64
            })

            const filter = (i) => i.user.id === message.author.id
            const collector = message.channel.createMessageComponentCollector({ filter, time: 1500000 })

            collector.on('collect', async (i) => {
                data.antilink.logs = i.values[0];
                client.antiraid.set(`secur_${message.guild.id}`, data);
                await i.update({ content: "Logs configurés" })
            })
        }


        //     max protect
        if (args[0] === "max") {
            data.antilink.status = true;
            data.antilink.link = "all";
            data.antilink.ignored_channel = [];
            data.antilink.ignored_role = [];
            data.antilink.ignored_user = [];
            data.antilink.sanction = "mute";
            data.antilink.rep = true;
            data.antilink.rep_limit = 1;
            data.antilink.logs = null;
            data.antilink.logs_status = true;
            client.antiraid.set(`secur_${message.guild.id}`, data);
            return message.reply({
                content: "L'antilink est configuré pour protéger au maximum",
            });
        }

        if (args[0] === 'panel') {
            let embed = new EmbedBuilder()
                .setTitle(message.guild.name + " - Module de sécurité")
                .setColor(parseInt(client.color.replace("#", ""), 16))
                .setDescription("Configuration du module de sécurité")
                .addFields({
                    name: "Statut",
                    value: data.antilink.status ? "<:Poulpyactif:1216368664773660692>" : "<:poulpynepasderanger:1216368662554869832>"
                }, {
                    name: "Ignorer les channels",
                    value: data.antilink.ignored_channel.length > 0 ? data.antilink.ignored_channel.map(c => `<#${c}>`).join(", ") : "Aucun"
                }, {
                    name: "Ignorer les rôles",
                    value: data.antilink.ignored_role.length > 0 ? data.antilink.ignored_role.map(r => `<@&${r}>`).join(", ") : "Aucun"
                }, {
                    name: "Ignorer les utilisateurs",
                    value: data.antilink.ignored_user.length > 0 ? data.antilink.ignored_user.map(u => `<@${u}>`).join(", ") : "Aucun"
                }, {
                    name: "Sanction",
                    value: data.antilink.sanction
                }, {
                    name: "Répétition",
                    value: data.antilink.rep ? "<:Poulpyactif:1216368664773660692>" : "<:poulpynepasderanger:1216368662554869832>"
                }, {
                    name: "Limite de répétition",
                    value: data.antilink.rep_limit
                }, {
                    name: "Temps de répétition",
                    value: data.antilink.rep_time
                }, {
                    name: "Logs",
                    value: data.antilink.logs_status ? "<:Poulpyactif:1216368664773660692>" : "<:poulpynepasderanger:1216368662554869832>"
                }, {
                    name: "Lien",
                    value: data.antilink.link
                })
                .setFooter({
                    text: client.config.footer.text
                })

            let menu1 = new StringSelectMenuBuilder()
                .setCustomId("antilink" + message.id)
                .setPlaceholder("Sélectionner une option")
                .addOptions([{
                    label: "Statut",
                    value: "status",
                    emoji: data.antilink.status ? "<:Poulpyactif:1216368664773660692>" : "<:poulpynepasderanger:1216368662554869832>"
                }, {
                    label: "Ignorer les channels",
                    value: "ignored_channel"
                }, {
                    label: "Ignorer les rôles",
                    value: "ignored_role"
                }, {
                    label: "Ignorer les utilisateurs",
                    value: "ignored_user"
                }])
            let menu2 = new StringSelectMenuBuilder()
                .setCustomId("antilink2" + message.id)
                .setPlaceholder("Sélectionner une option")
                .addOptions([{
                    label: "Sanction",
                    value: "sanction"
                }, {
                    label: "Répétition",
                    value: "rep",
                    emoji: data.antilink.rep ? "<:Poulpyactif:1216368664773660692>" : "<:poulpynepasderanger:1216368662554869832>"
                }, {
                    label: "Limite de répétition",
                    value: "rep_limit"
                }, {
                    label: "Logs",
                    value: "logs",
                    emoji: data.antilink.logs_status ? "<:Poulpyactif:1216368664773660692>" : "<:poulpynepasderanger:1216368662554869832>"
                }, {
                    label: "Lien",
                    value: "link"
                }])
            let row = new ActionRowBuilder()
                .addComponents(menu1)

            let row2 = new ActionRowBuilder()
                .addComponents(menu2)

            let msg = await message.channel.send({
                embeds: [embed],
                components: [row, row2]
            })

            const filter = (i) => i.user.id === message.author.id
            const collector = message.channel.createMessageComponentCollector({ filter, time: 1500000 })

            collector.on('collect', async (i) => {
                if (i.customId === "antilink" + message.id) {
                    if (i.values[0] === "status") {
                        data.antilink.status = !data.antilink.status;
                        client.antiraid.set(`secur_${message.guild.id}`, data);
                        embed.fields[0].value = data.antilink.status ? "<:Poulpyactif:1216368664773660692>" : "<:poulpynepasderanger:1216368662554869832>";
                        await i.update({ embeds: [embed], components: [row, row2] })
                    }
                    if (i.values[0] === "ignored_channel") {
                        let menu = new ChannelSelectMenuBuilder()
                            .setCustomId("antilink3" + message.id)
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
                            .setCustomId("antilink4" + message.id)
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
                            .setCustomId("antilink5" + message.id)
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
                if (i.customId === "antilink2" + message.id) {
                    if (i.values[0] === "sanction") {
                        let menu = new StringSelectMenuBuilder()
                            .setCustomId("antilink6" + message.id)
                            .setPlaceholder("Sélectionner une sanction")
                            .addOptions(["mute", "kick", "ban", "derank", "warn"].map(s => {
                                return {
                                    label: s,
                                    value: s
                                }
                            }))
                        let row = new ActionRowBuilder()
                            .addComponents(menu)
                        await i.update({ embeds: [embed], components: [row] })
                    }
                    if (i.values[0] === "rep") {
                        data.antilink.rep = !data.antilink.rep;
                        client.antiraid.set(`secur_${message.guild.id}`, data);
                        embed.fields[5].value = data.antilink.rep ? "<:Poulpyactif:1216368664773660692>" : "<:poulpynepasderanger:1216368662554869832>";
                        await i.update({ embeds: [embed], components: [row, row2] })
                    }
                    if (i.values[0] === "rep_limit") {
                        let menu = new StringSelectMenuBuilder()
                            .setCustomId("antilink7" + message.id)
                            .setPlaceholder("Sélectionner une limite")
                            .addOptions([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(l => {
                                return {
                                    label: l,
                                    value: l
                                }
                            }))
                        let row = new ActionRowBuilder()
                            .addComponents(menu)
                        await i.update({ embeds: [embed], components: [row] })
                    }
                    if (i.values[0] === "logs") {

                        let menu = new ChannelSelectMenuBuilder()
                            .setCustomId("antilink8" + message.id)
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
                    if (i.values[0] === "link") {
                        let menu = new StringSelectMenuBuilder()
                            .setCustomId("antilink9" + message.id)
                            .setPlaceholder("Sélectionner un type de lien")
                            .addOptions(["all", "discord", "http"].map(l => {
                                return {
                                    label: l,
                                    value: l
                                }
                            }))
                        let row = new ActionRowBuilder()
                            .addComponents(menu)
                        await i.update({ embeds: [embed], components: [row] })
                    }
                }

                if (i.customId === "antilink3" + message.id) {
                    data.antilink.ignored_channel.push(i.values[0]);
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    embed.fields[1].value = data.antilink.ignored_channel.length > 0 ? data.antilink.ignored_channel.map(c => `<#${c}>`).join(", ") : "Aucun";
                    await i.update({ embeds: [embed], components: [row, row2] })
                }

                if (i.customId === "antilink4" + message.id) {
                    data.antilink.ignored_role.push(i.values[0]);
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    embed.fields[2].value = data.antilink.ignored_role.length > 0 ? data.antilink.ignored_role.map(r => `<@&${r}>`).join(", ") : "Aucun";
                    await i.update({ embeds: [embed], components: [row, row2] })
                }

                if (i.customId === "antilink5" + message.id) {
                    data.antilink.ignored_user.push(i.values[0]);
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    embed.fields[3].value = data.antilink.ignored_user.length > 0 ? data.antilink.ignored_user.map(u => `<@${u}>`).join(", ") : "Aucun";
                    await i.update({ embeds: [embed], components: [row, row2] })
                }

                if (i.customId === "antilink6" + message.id) {
                    data.antilink.sanction = i.values[0];
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    embed.fields[4].value = data.antilink.sanction;
                    await i.update({ embeds: [embed], components: [row, row2] })
                }

                if (i.customId === "antilink7" + message.id) {
                    data.antilink.rep_limit = i.values[0];
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    embed.fields[6].value = data.antilink.rep_limit;
                    await i.update({ embeds: [embed], components: [row, row2] })
                }

                if (i.customId === "antilink8" + message.id) {
                    data.antilink.logs = i.values[0];
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    embed.fields[8].value = data.antilink.logs_status ? "<:Poulpyactif:1216368664773660692>" : "<:poulpynepasderanger:1216368662554869832>";
                    await i.update({ embeds: [embed], components: [row, row2] })
                }

                if (i.customId === "antilink9" + message.id) {
                    data.antilink.link = i.values[0];
                    client.antiraid.set(`secur_${message.guild.id}`, data);
                    embed.fields[9].value = data.antilink.link;
                    await i.update({ embeds: [embed], components: [row, row2] })
                }
            })
        }
    }
}