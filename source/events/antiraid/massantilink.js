const { Client, Message } = require("discord.js");
const ms = require("ms");
const { EmbedBuilder } = require("discord.js");

// Liens à détecter
const linksall = [
    "discord.gg",
    "dsc.bio",
    "www",
    "https",
    "http",
    ".ga",
    ".fr",
    ".com",
    ".tk",
    ".ml",
    ".gg",
    "discord.me",
    "discord.io",
    "invite.me",
    "discordapp.com/invite"
];

// Ensemble pour suivre les canaux en cours de raid
const currentRaids = new Set();

// Map pour stocker les messages dans les canaux en cours de raid
const messages = new Map();

module.exports = {
    name: "messageCreate",
    run: async (client, message) => {
        if (!message.guild || message.author.bot) return;

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
        };

        const { massantilink } = data;

        if (!massantilink || !massantilink.status) return;

        const checkMessage = (content, links) => links.some(word => content.toLowerCase().includes(word));

        // Vérifier si le lien détecté correspond à celui autorisé dans la configuration
        const checkLinkType = (messageContent) => {
            switch (massantilink.link) {
                case "all":
                    return checkMessage(messageContent, linksall);
                case "dsc":
                    return checkMessage(messageContent, linksdsc);
                case "http":
                    return checkMessage(messageContent, linkshttp);
                default:
                    return false;
            }
        };

        if (checkLinkType(message.content)) {
            let channelData = messages.get(message.channel.id) || new Map();
            let userData = channelData.get(message.author.id) || new Set();

            userData.add(message.id);
            channelData.set(message.author.id, userData);
            messages.set(message.channel.id, channelData);

            // Si le raid est détecté pour la première fois, commencez à attendre la fin du spam
            if (userData.size > massantilink.rep_limit && !currentRaids.has(message.channel.id)) {
                currentRaids.add(message.channel.id);
                await waitEnd(client, message.guild.id, message.channel.id, message.author.id, userData.size);
            }
        }
    }
};

async function waitEnd(client, guildId, channelId, authorId, currentLength) {
    const data = client.antiraid.get(`secur_${guildId}`) || {
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
    };

    const channelData = messages.get(channelId);
    if (!channelData) return;

    const userData = channelData.get(authorId);
    if (!userData) return;

    try {
        const channel = client.channels.cache.get(channelId);
        if (!channel) return;

        const userMessages = Array.from(userData);

        // Supprimer tous les messages de l'auteur du spam en une seule fois
        await channel.bulkDelete(userMessages)
            .then(deleted => {
                console.log(`Supprimé ${deleted.size} messages de ${client.users.cache.get(authorId).username}`);
            })
            .catch(console.error);

        // Supprimer les données de l'utilisateur et du canal
        channelData.delete(authorId);
        messages.set(channelId, channelData);

        // Réinitialiser le raid actuel
        currentRaids.delete(channelId);

        const modLogs = client.channels.cache.get(data.massantilink.logs);
        if (data.massantilink.logs_status && modLogs) {
            const embed = new EmbedBuilder()
                .setTitle("Raid détecté")
                .setDescription(`Un raid a été détecté dans <#${channelId}>`)
                .addFields({
                    name: "Utilisateur",
                    value: `<@${authorId}>`
                }, {
                    name: "Nombre de messages",
                    value: currentLength
                }, {
                    name: "Sanction",
                    value: data.massantilink.sanction
                })
                .setColor(client.color.replace("#", ""))
                .setFooter(`ID: ${authorId} | ${client.config.footer.text}`)
                .setTimestamp();

            modLogs.send({ embeds: [embed] });
        }

        // Appliquer la sanction
        switch (data.massantilink.sanction) {
            case "mute":
                const time = ms("15m");
                await client.guilds.cache.get(guildId).members.fetch(authorId).then(member => {
                    member.timeout(time, "Clarity Anti-raid system");
                });
                break;
            case "kick":
                await client.guilds.cache.get(guildId).members.fetch(authorId).then(member => {
                    member.kick("Clarity Anti-raid system");
                });
                break;
            case "ban":
                await client.guilds.cache.get(guildId).members.fetch(authorId).then(member => {
                    member.ban({ reason: "Clarity Anti-raid system" });
                });
                break;
            case "warn":
                await client.guilds.cache.get(guildId).members.fetch(authorId).then(member => {
                    const embed = new EmbedBuilder()
                        .setTitle("Warn")
                        .setDescription(`Vous avez été warn dans le serveur : ${member.guild.name}`)
                        .addFields({
                            name: "Raison",
                            value: "Envoi de lien en masse"
                        }, {
                            name: "Modérateur",
                            value: client.user.tag

                        })
                        .setColor(client.color.replace("#", ""))
                        .setFooter(client.config.footer)
                        .setTimestamp();
                    member.send({ embeds: [embed] });
                    let warn = client.data.get(`warn_${guildId}_${authorId}`) || [];
                    warn.push({ reason: "Envoi de lien en masse", date: Date.now(), moderator: client.user.id });
                    client.data.set(`warn_${guildId}_${authorId}`, warn);
                });
                break;
            case "derank":
                await client.guilds.cache.get(guildId).members.fetch(authorId).then(member => {
                    let roles = member.roles.cache.filter((r) => r.id !== guildId);
                    member.roles.set(roles);
                });
                break;
            default:
                break;
        }

        // Appeler la fonction pour supprimer tous les messages restants dans le canal
        await deleteRemainingMessages(channel, authorId);

    } catch (error) {
        console.error("Une erreur s'est produite lors de la suppression des messages de spam :", error);
    }
}

async function deleteRemainingMessages(channel, authorId) {
    try {
        let fetchedMessages = await channel.messages.fetch({ limit: 100 });
        if (fetchedMessages.size === 0) return;

        fetchedMessages = fetchedMessages.filter(msg => msg.author.id === authorId);

        if (fetchedMessages.size === 0) return;

        await channel.bulkDelete(fetchedMessages);
        // S'il reste encore des messages, rappeler la fonction récursivement
        await deleteRemainingMessages(channel, authorId);
    } catch (error) {
        console.error("Une erreur s'est produite lors de la suppression des messages restants :", error);
    }
}





