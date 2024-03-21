const { EmbedBuilder ,ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder , ChannelSelectMenuBuilder , RoleSelectMenuBuilder , UserSelectMenuBuilder} = require("discord.js");

module.exports = {
    name : "massantilink",
    description : "Configure l'antilink",
    run: async(client, message, args) => {
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
            massantilink: {
                status: false,
                ignored_channel: [],
                ignored_role: [],
                ignored_user: [],
                sanction: "mute",
                rep: false,
                rep_limit: 5,
                logs: null,
                logs_status: false,
                link: "all"
            }
        }

        if (!data.massantilink) {
            data.massantilink = {
                status: false,
                ignored_channel: [],
                ignored_role: [],
                ignored_user: [],
                sanction: "mute",
                rep: false,
                rep_limit: 5,
                logs: null,
                logs_status: false,
                link: "all"
            };
        }

        if (!args[0]) {
            return message.reply({
                content: `Merci de préciser une option : \`massantilink <on/off/max/allow/sanction/limit/logs/panel>\``,
            });
        }

        if (args[0] === "on") {
            data.massantilink.status = true;
            await client.antiraid.set(`secur_${message.guild.id}`, data);
            return message.reply({
                content: "Le massantilink est maintenant activé",
            });
        }

        if (args[0] === "off") {
            data.massantilink.status = false
            await client.antiraid.set(`secur_${message.guild.id}`, data)
            return message.reply({
                content: "Le massantilink est maintenant désactivé",
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

            let filter = i => i.user.id === message.author.id
            let collector = message.channel.createMessageComponentCollector({
                filter,
                time: 60000
            })

            collector.on("collect", async i => {
                if (i.customId === "allow_user" + message.id) {
                    data.massantilink.ignored_user.push(i.values[0])
                    await client.antiraid.set(`secur_${message.guild.id}`, data)
                    return message.reply({
                        content: "L'utilisateur a bien été ajouté à la liste des utilisateurs ignorés"
                    })
                }
                if (i.customId === "allow_role" + message.id) {
                    data.massantilink.ignored_role.push(i.values[0])
                    await client.antiraid.set(`secur_${message.guild.id}`, data)
                    return message.reply({
                        content: "Le rôle a bien été ajouté à la liste des rôles ignorés"
                    })
                }
                if (i.customId === "allow_channel" + message.id) {
                    data.massantilink.ignored_channel.push(i.values[0])
                    await client.antiraid.set(`secur_${message.guild.id}`, data)
                    return message.reply({
                        content: "Le salon a bien été ajouté à la liste des salons ignorés"
                    })
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
            let row = new ActionRowBuilder()
                .addComponents(menu)
            await message.reply({
                components: [row],
                flags: 64
            })

            const filter = (i) => i.user.id === message.author.id
            const collector = message.channel.createMessageComponentCollector({ filter, time: 1500000 })

            collector.on("collect", async i => {
                if (i.customId === "antilink6" + message.id) {
                    data.massantilink.sanction = i.values[0]
                    await client.antiraid.set(`secur_${message.guild.id}`, data)
                    return message.reply({
                        content: "La sanction a bien été modifiée"
                    })
                }
            })
        }

        if (args[0] === "limit") {
            let menu = new StringSelectMenuBuilder()
                .setCustomId("antilink7" + message.id)
                .setPlaceholder("Sélectionner un nombre")
                .addOptions(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map(s => {
                    return {
                        label: s,
                        value: s
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

            collector.on("collect", async i => {
                if (i.customId === "antilink7" + message.id) {
                    data.massantilink.rep_limit = i.values[0]
                    await client.antiraid.set(`secur_${message.guild.id}`, data)
                    return message.reply({
                        content: "Le nombre a bien été modifié"
                    })
                }
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

            collector.on("collect", async i => {
                if (i.customId === "antilink8" + message.id) {
                    data.massantilink.logs = i.values[0]
                    await client.antiraid.set(`secur_${message.guild.id}`, data)
                    return message.reply({
                        content: "Le salon a bien été modifié"
                    })
                }
            })
        }
        if (args[0] === "max") {
            data.massantilink.status = true;
            data.massantilink.link = "all";
            data.massantilink.ignored_channel = [];
            data.massantilink.ignored_role = [];
            data.massantilink.ignored_user = [];
            data.massantilink.sanction = "mute";
            data.massantilink.rep = false;
            data.massantilink.rep_limit = 1;
            data.massantilink.logs = null;
            data.massantilink.logs_status = true;
            await client.antiraid.set(`secur_${message.guild.id}`, data);
            return message.reply({
                content: "Le massantilink est maintenant configuré pour protéger au maximum",
            });
        }

    }
}