const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ChannelSelectMenuBuilder, RoleSelectMenuBuilder, UserSelectMenuBuilder } = require("discord.js");
const ms = require("ms");
module.exports = {
    name: "antispam",
    description: "Configure l'antispam",
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
            antispam: {
                status: false,
                ignored_channel: [],
                ignored_role: [],
                ignored_user: [],
                sanction: "mute",
                sanction_admin: "derank",
                interval: 2000,
                message_limit: 5,
                logs: null,
                logs_status: false
            }
        };

        if (!data.antispam) {
            data.antispam = {
                status: false,
                ignored_channel: [],
                ignored_role: [],
                ignored_user: [],
                sanction: "mute",
                sanction_admin: "derank",
                interval: 2000,
                message_limit: 5,
                logs: null,
                logs_status: false
            };
        }

        if (!args[0]) {
            return message.reply({
                content: `Merci de préciser une option : \`antispam <on/off/sanction/interval/allow/limit/logs/panel>\``,
            });
        }

        if (args[0] === "on") {
            data.antispam.status = true;
            await client.antiraid.set(`secur_${message.guild.id}`, data);
            return message.reply({
                content: "L'antispam est maintenant activé",
            });
        }

        if (args[0] === "off") {
            data.antispam.status = false;
            await client.antiraid.set(`secur_${message.guild.id}`, data);
            return message.reply({
                content: "L'antispam est maintenant désactivé",
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
                components: [row, row2],
                flags: 64
            })

            const filter = (i) => i.user.id === message.author.id
            const collector = message.channel.createMessageComponentCollector({ filter, time: 1500000 })
            collector.on("collect", async i => {
                if (i.customId === "antilink6" + message.id) {
                    data.antispam.sanction = i.values[0];
                    await client.antiraid.set(`secur_${message.guild.id}`, data);
                    return i.reply({
                        content: `La sanction a été changée pour \`${i.values[0]}\``,
                        ephemeral: true
                    });
                }
                if (i.customId === "antilink7" + message.id) {
                    data.antispam.sanction_admin = i.values[0];
                    await client.antiraid.set(`secur_${message.guild.id}`, data);
                    return i.reply({
                        content: `La sanction pour les administrateurs a été changée pour \`${i.values[0]}\``,
                        ephemeral: true
                    });
                }
            })
        }

        if (args[0] === "interval") {
            if (!args[1]) {
                return message.reply({
                    content: "Merci de préciser un intervalle : `antispam interval <intervalle> exemple : antispam interval 2s`",
                });
            }
            data.antispam.interval = ms(args[1]);
            await client.antiraid.set(`secur_${message.guild.id}`, data);
            return message.reply({
                content: `L'intervalle a été changé pour \`${args[1]}\``,
            });
        }

        if (args[0] === "limit") {
            if (!args[1]) {
                return message.reply({
                    content: "Merci de préciser un nombre : `antispam limit <nombre>`",
                });
            }
            if (isNaN(args[1])) {
                return message.reply({
                    content: "Merci de préciser un nombre valide",
                });
            }
            data.antispam.message_limit = args[1];
            await client.antiraid.set(`secur_${message.guild.id}`, data);
            return message.reply({
                content: `Le nombre de messages a été changé pour \`${args[1]}\``,
            });
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
                    data.antispam.logs = i.values[0];
                    await client.antiraid.set(`secur_${message.guild.id}`, data);
                    return i.reply({
                        content: `Les logs ont été changés pour <#${i.values[0]}>`,
                    });
                }
            })
        }


        if (args[0] === "panel") {
            let embed = new EmbedBuilder()
                .setTitle("Panel de configuration de l'antispam")
                .setDescription(`Status : ${data.antispam.status ? "Activé" : "Désactivé"}\nSanction : ${data.antispam.sanction}\nIntervalle : ${ms(data.antispam.interval)}\nNombre de messages : ${data.antispam.message_limit}\nLogs : ${data.antispam.logs ? `<#${data.antispam.logs}>` : "Aucun"}`)
                .setColor("BLUE")
            return message.reply({
                embeds: [embed]
            });
        }

        if (args[0] === "max") {
            data.antispam.message_limit = 5;
            data.antispam.interval = 1000;
            data.antispam.status = true;
            data.antispam.sanction = "mute";
            data.antispam.logs = null;
            data.antispam.logs_status = false;
            data.antispam.ignored_channel = [];
            data.antispam.ignored_role = [];
            data.antispam.ignored_user = [];
            await client.antiraid.set(`secur_${message.guild.id}`, data);

            return message.reply({
                content: "L'antispam a été configuré au maximum",
            });
        }


    }
}