const { Client, Message } = require("discord.js");
const Clarity = require("../../structures/client/index");
const { EmbedBuilder } = require("discord.js");
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

const ms = require("ms");
module.exports = {
    name: "messageCreate",
    run: async (client, message) => {
        if (!message.guild || message.author.id === client.user.id) return
        let data = client.antiraid.get(`secur_${message.guild.id}`) || {
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
        }
        if (!data.antilink || !data.antilink.status) return;
        if (data.antilink.ignored_channel.includes(message.channel.id)) return;
        if (data.antilink.ignored_role.some(r => message.member.roles.cache.has(r))) return;
        if (data.antilink.ignored_user.includes(message.author.id)) return;


        if (data.antilink.link === "all") {
            if (
                linksall.some((word) => message.content.toLowerCase().includes(word))
            ) {
                if (data.antilink.sanction === "mute") {
                    message.delete().catch(() => {
                    });
                    if (data.antilink.rep === true) {
                        message.reply({
                            content: "Tu n'as pas le droit d'envoyer des liens ici !"
                        }).catch(() => {
                        });
                    }
                    let reason = "Clarity Anti-raid system";
                    const time = ms("15m")
                    message.member.timeout(time, reason);
                } else if (data.antilink.sanction === "kick") {
                    message.delete().catch(() => {
                    });
                    if (data.antilink.rep === true) {
                        message.reply({
                            content: "Tu n'as pas le droit d'envoyer des liens ici !"
                        }).catch(() => {
                        });
                    }
                    message.member.kick({reason: "Clarity Anti-raid system"}).catch(() => {
                    });
                } else if (data.antilink.sanction === "ban") {
                    message.delete().catch(() => {
                    });
                    if (data.antilink.rep === true) {
                        message.reply({
                            content: "Tu n'as pas le droit d'envoyer des liens ici !"
                        }).catch(() => {
                        });
                    }
                    message.member.ban({reason: "Clarity Anti-raid system"}).catch(() => {
                    });
                }
            }
        } else if (data.antilink.link === "dsc") {
            if (
                linksdsc.some((word) => message.content.toLowerCase().includes(word))
            ) {
                if (data.antilink.sanction === "mute") {
                    message.delete().catch(() => {
                    });
                    if (data.antilink.rep === true) {
                        message.reply({
                            content: "Tu n'as pas le droit d'envoyer des liens ici !"
                        }).catch(() => {
                        });
                    }
                    let reason = "Clarity Anti-raid system";
                    const time = ms("15m")
                    message.member.timeout(time, reason);
                } else if (data.antilink.sanction === "kick") {
                    message.delete().catch(() => {
                    });
                    if (data.antilink.rep === true) {
                        message.reply({
                            content: "Tu n'as pas le droit d'envoyer des liens ici !"
                        }).catch(() => {
                        });
                    }
                    message.member.kick({reason: "Clarity Anti-raid system"}).catch(() => {
                    });
                } else if (data.antilink.sanction === "ban") {
                    message.delete().catch(() => {
                    });
                    if (data.antilink.rep === true) {
                        message.reply({
                            content: "Tu n'as pas le droit d'envoyer des liens ici !"
                        }).catch(() => {
                        });
                    }
                    message.member.ban({reason: "Clarity Anti-raid system"}).catch(() => {
                    });
                }
            }
        } else if (data.antilink.link === "http") {
            if (
                linkshttp.some((word) => message.content.toLowerCase().includes(word))
            ) {
                if (data.antilink.sanction === "mute") {
                    message.delete().catch(() => {
                    });
                    if (data.antilink.rep === true) {
                        message.reply({
                            content: "Tu n'as pas le droit d'envoyer des liens ici !"
                        }).catch(() => {
                        });
                    }
                    let reason = "Clarity Anti-raid system";
                    const time = ms("15m")
                    message.member.timeout(time, reason);
                } else if (data.antilink.sanction === "kick") {
                    message.delete().catch(() => {
                    });
                    if (data.antilink.rep === true) {
                        message.reply({
                            content: "Tu n'as pas le droit d'envoyer des liens ici !"
                        }).catch(() => {
                        });
                    }
                    message.member.kick({reason: "Clarity Anti-raid system"}).catch(() => {
                    });
                } else if (data.antilink.sanction === "ban") {
                    message.delete().catch(() => {
                    });
                    if (data.antilink.rep === true) {
                        message.reply({
                            content: "Tu n'as pas le droit d'envoyer des liens ici !"
                        }).catch(() => {
                        });
                    }
                    message.member.ban({reason: "Clarity Anti-raid system"}).catch(() => {
                    });
                }
            }
        }

            if (data.antilink.logs_status === true && data.antilink.logs) {
                let channel = message.guild.channels.cache.get(data.antilink.logs)
                if (channel) {
                    channel.send({
                        embeds: [{
                            title: "Lien envoyé",
                            description: `Un lien a été envoyé par ${message.author.tag} dans le salon ${message.channel.name}`,
                            fields: [{
                                name: "Lien",
                                value: message.content
                            }],
                            color: parseInt(client.color.replace("#", ""), 16),
                            timestamp: new Date(),
                            footer: {
                                text: client.config.footer
                            },
                            thumbnail: {
                                url: message.author.displayAvatarURL({dynamic: true})
                            }
                        }]
                    })
                }
            }
        }

}
