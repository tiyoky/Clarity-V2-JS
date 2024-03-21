const { EmbedBuilder } = require("discord.js");

// Ensemble pour suivre les canaux en cours de spam
const currentSpams = new Set();

// Map pour stocker les messages dans les canaux en cours de spam
const messages = new Map();
const ms = require("ms");
module.exports = {
    name: "messageCreate",
    run: async (client, message) => {
        if (!message.guild || message.author.bot) return;

        let data = client.antiraid.get(`secur_${message.guild.id}`) || {
            antispam: {
                status: false,
                ignored_channel: [],
                ignored_role: [],
                ignored_user: [],
                sanction: "mute",
                interval: 2000,
                message_limit: 5,
                logs: null,
                logs_status: false
            }
        };

        const { antispam } = data;

        if (!antispam || !antispam.status) return;

        let channelData = messages.get(message.channel.id) || new Map();
        let userData = channelData.get(message.author.id) || { count: 0, lastMessage: null };

        const interval = antispam.interval;

        // Vérifier si le temps écoulé depuis le dernier message est inférieur à l'intervalle défini
        if (userData.lastMessage && (message.createdTimestamp - userData.lastMessage < interval)) {
            userData.count++;
        } else {
            // Si le temps écoulé est supérieur à l'intervalle, réinitialiser le compteur
            userData.count = 1;
        }

        // Enregistrer l'heure du dernier message
        userData.lastMessage = message.createdTimestamp;
        channelData.set(message.author.id, userData);
        messages.set(message.channel.id, channelData);

        // Si le nombre de messages dépasse la limite autorisée, traiter comme un spam
        if (userData.count > antispam.message_limit && !currentSpams.has(message.channel.id)) {
            currentSpams.add(message.channel.id);
            await waitEnd(client, message.guild.id, message.channel.id, message.author.id, userData.count, antispam);
        }
    }
};

async function waitEnd(client, guildId, channelId, authorId, currentLength, antispam) {
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
        // Réinitialiser le spam actuel
        currentSpams.delete(channelId);
        const modLogs = client.channels.cache.get(antispam.logs);
        if (antispam.logs_status && modLogs) {
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
                    value: antispam.sanction
                })
                .setColor(client.color.replace("#", ""))
                .setFooter(`ID: ${authorId} | ${client.config.footer.text}`)
                .setTimestamp();

            modLogs.send({embeds: [embed]});
        }
        // Appliquer la sanction
        switch (antispam.sanction) {
            case "mute":
                const time = ms("15m");
                await client.guilds.cache.get(guildId).members.fetch(authorId).then(member => {
                    member.timeout(time, "Clarity Anti-raid system");
                });
                break;
            case "kick":
                await client.guilds.cache.get(guildId).members.fetch(authorId).then(member => {
                    member.kick({reason: "Clarity Anti-raid system"});
                });
                break;
            case "ban":
                await client.guilds.cache.get(guildId).members.fetch(authorId).then(member => {
                    member.ban({reason: "Clarity Anti-raid system"});
                });
                break;
            case "warn":
                await client.guilds.cache.get(guildId).members.fetch(authorId).then(member => {
                    const embed = new EmbedBuilder()
                        .setTitle("Warn")
                        .setDescription(`Vous avez été warn dans le serveur : ${member.guild.name}`)
                        .addFields({
                            name: "Raison",
                            value: "Spam "
                        }, {
                            name: "Modérateur",
                            value: client.user.tag

                        })
                        .setColor(client.color.replace("#", ""))
                        .setFooter(client.config.footer)
                        .setTimestamp();
                    member.send({embeds: [embed]});
                    let warn = client.data.get(`warn_${guildId}_${authorId}`) || [];
                    warn.push({reason: "Spam", date: Date.now(), moderator: client.user.id});
                    client.data.set(`warn_${guildId}_${authorId}`, warn);
                });
                break;
            case "derank":
                await client.guilds.cache.get(guildId).members.fetch(authorId).then(member => {
                    // Supprimer tout les roles appart le role de base
                    let roles = member.roles.cache.filter((r) => r.id !== guildId);
                    member.roles.remove(roles, "Clarity Anti-raid system");
                });
                break;
            default:
                break;
        }

        // Appeler la fonction pour supprimer tous les messages restants dans le canal
        await deleteRemainingMessages(channel, authorId);

    } catch (error) {
        console.error("Une erreur s'est produite lors du traitement du spam :", error);
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
