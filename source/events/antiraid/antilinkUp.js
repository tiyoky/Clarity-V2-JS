const { Client, Message } = require("discord.js");
const Clarity = require("../../structures/client/index");
const { EmbedBuilder } = require("discord.js");
const ms = require("ms");
const linksall = [
    "discord.gg",
    "dsc.bio",
    "www",
    "https",
    "Https",
    "Http",
    "HT",
    "HTTP",
    "HTTPS",
    "http",
    ".ga",
    ".fr",
    ".com",
    ".tk",
    ".ml",
    "://",
    ".gg",
    "discord.me",
    "discord.io",
    "invite.me",
    "discordapp.com/invite",
    "discord.me",
    "discord.io",
    "invite.me",
    "discordapp.com/invite",
];

const linksdsc = [
    "dsc.bio",
    "discord.gg",
    "discord.me",
    "discord.io",
    "invite.me",
    "discordapp.com/invite",
    ".gg"
];

const linkshttp = [
    "www",
    "https",
    "Https",
    "Http",
    "HT",
    "HTTP",
    "HTTPS",
    "http",
    ".ga",
    ".fr",
    ".com",
    ".tk",
    ".ml",
    "://",
];
module.exports = {
    name: "messageUpdate",
    run: async (client, oldMessage, newMessage) => {
        if (!newMessage.guild || newMessage.author.id === client.user.id) return;
        if (newMessage.content === oldMessage.content) return;

        let data = client.antiraid.get(`secur_${newMessage.guild.id}`) || {
            antilink: {
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
        };

        if (!data.antilink || !data.antilink.status) return;

        if (data.antilink.ignored_channel.includes(newMessage.channel.id)) return;
        if (data.antilink.ignored_role.some(r => newMessage.member.roles.cache.has(r))) return;
        if (data.antilink.ignored_user.includes(newMessage.author.id)) return;

        if (data.antilink.link === "all") {
            if (
                linksall.some((word) => newMessage.content.toLowerCase().includes(word))
            ) {
                handleViolation(client, newMessage, data);
            }
        } else if (data.antilink.link === "dsc") {
            if (
                linksdsc.some((word) => newMessage.content.toLowerCase().includes(word))
            ) {
                handleViolation(client, newMessage, data);
            }
        } else if (data.antilink.link === "http") {
            if (
                linkshttp.some((word) => newMessage.content.toLowerCase().includes(word))
            ) {
                handleViolation(client, newMessage, data);
            }
        }

        if (data.antilink.logs_status && data.antilink.logs) {
            let channel = newMessage.guild.channels.cache.get(data.antilink.logs);
            if (channel) {
                channel.send({
                    embeds: [{
                        title: "Lien modifié",
                        description: `Un lien a été modifié par ${newMessage.author.tag} dans le salon ${newMessage.channel.name}`,
                        fields: [{
                            name: "Ancien lien",
                            value: oldMessage.content
                        },
                            {
                                name: "Nouveau lien",
                                value: newMessage.content
                            }],
                        color: parseInt(client.color.replace("#", ""), 16),
                        timestamp: new Date(),
                        footer: {
                            text: client.config.footer
                        },
                        thumbnail: {
                            url: newMessage.author.displayAvatarURL({dynamic: true})
                        }
                    }]
                });
            }
        }
    }
};

function handleViolation(client, message, data) {
    if (data.antilink.sanction === "mute") {
        message.delete().catch(() => {});
        if (data.antilink.rep === true) {
            message.reply({
                content: "Tu n'as pas le droit d'envoyer des liens ici !"
            }).catch(() => {});
        }
        let reason = "Clarity Anti-raid system";
        const time = ms("15m")
        message.member.timeout(time, reason);
    } else if (data.antilink.sanction === "kick") {
        message.delete().catch(() => {});
        if (data.antilink.rep === true) {
            message.reply({
                content: "Tu n'as pas le droit d'envoyer des liens ici !"
            }).catch(() => {});
        }
        message.member.kick({reason: "Clarity Anti-raid system"}).catch(() => {});
    } else if (data.antilink.sanction === "ban") {
        message.delete().catch(() => {});
        if (data.antilink.rep === true) {
            message.reply({
                content: "Tu n'as pas le droit d'envoyer des liens ici !"
            }).catch(() => {});
        }
        message.member.ban({reason: "Clarity Anti-raid system"}).catch(() => {});
    }
}
