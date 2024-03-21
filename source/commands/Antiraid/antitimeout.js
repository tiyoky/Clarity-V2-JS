const { EmbedBuilder ,ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder , ChannelSelectMenuBuilder , RoleSelectMenuBuilder , UserSelectMenuBuilder} = require("discord.js");
const ms = require("ms");
module.exports = {
    name: "antitimeout",
    description: "Configure le timeout",
    usage: "antitimeout <on/off/sanction/allow/logs/panel>",
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
            antiTimeout: {
                status: false,
                ignored_role: [],
                ignored_user: [],
                sanction: "mute",
                logs: null,
                logs_status: false
            }
        };
        if (!data.antiTimeout) {
            data.antiTimeout = {
                status: false,
                ignored_role: [],
                ignored_user: [],
                sanction: "mute",
                logs: null,
                logs_status: false
            };
        }
        if (!args[0]) {
            return message.reply({
                content: `Merci de préciser une option : \`antitimeout <on/off/sanction/allow/logs/panel>\``,
            });
        }
        if (args[0] === "on") {
            data.antiTimeout.status = true;
            await client.antiraid.set(`secur_${message.guild.id}`, data);
            return message.reply({
                content: "L'antitimeout est maintenant activé",
            });
        }
        if (args[0] === "off") {
            data.antiTimeout.status = false;
            await client.antiraid.set(`secur_${message.guild.id}`, data);
            return message.reply({
                content: "L'antitimeout est maintenant désactivé",
            });
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
            collector.on('collect', async i => {
                if (i.customId.startsWith("antilink6")) {
                    data.antiTimeout.sanction = i.values[0]
                    await client.antiraid.set(`secur_${message.guild.id}`, data);
                    i.update({
                        content: "La sanction a été changée",
                        components: []
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
            collector.on('collect', async i => {
                if (i.customId.startsWith("antilink8")) {
                       data.antiTimeout.logs = i.values[0]
                    await client.antiraid.set(`secur_${message.guild.id}`, data);
                    i.update({
                        content: "Le channel a été changé",
                        components: []
                    })
                }
            })
        }
        if (args[0] === "allow") {
            let menu = new RoleSelectMenuBuilder()
                .setCustomId("antilink10" + message.id)
                .setPlaceholder("Sélectionner un role")

            let menu2 = new UserSelectMenuBuilder()
                .setCustomId("antilink11" + message.id)
                .setPlaceholder("Sélectionner un utilisateur")
            let row = new ActionRowBuilder()
                .addComponents(menu, menu2)
            await message.reply({
                components: [row],
                flags: 64
            })

            const filter = (i) => i.user.id === message.author.id
            const collector = message.channel.createMessageComponentCollector({ filter, time: 1500000 })
            collector.on('collect', async i => {
                if (i.customId.startsWith("antilink10")) {
                    data.antiTimeout.ignored_role.push(i.values[0])
                    await client.antiraid.set(`secur_${message.guild.id}`, data);
                    i.update({
                        content: "Le role a été ajouté",
                        components: []
                    })
                }
                if (i.customId.startsWith("antilink11")) {
                    data.antiTimeout.ignored_user.push(i.values[0])
                    await client.antiraid.set(`secur_${message.guild.id}`, data);
                    i.update({
                        content: "L'utilisateur a été ajouté",
                        components: []
                    })
                }
            })
        }

    }
}