async function waitEnd(client, newMessage) {
    // Données de configuration
    let data = client.antiraid.get(`secur_${newMessage.guild.id}`) || {
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
    // Attendez 3 secondes avant de vérifier à nouveau
    await new Promise(resolve => setTimeout(resolve, 3000));

    const channelData = messages.get(newMessage.channel.id);
    if (!channelData) return;

    const userData = channelData.get(newMessage.author.id);
    if (!userData) return;

    const currentLength = userData.size;

    // Si la longueur du spam n'a pas changé pendant les 3 secondes, supprimez les messages et terminez le raid
    if (currentLength === userData.size) {
        try {
            await newMessage.channel.bulkDelete(Array.from(userData));
            currentRaids.delete(newMessage.author.id);
            messages.delete(newMessage.channel.id);

            // Envoie un message de modération
            const modLogs = newMessage.guild.channels.cache.get(data.massantilink.logs);
            if (data.massantilink.logs_status && modLogs) {
                const embed = new EmbedBuilder()
                    .setTitle("Raid détecté")
                    .setDescription(`Un raid a été détecté dans ${newMessage.channel}`)
                    .addFields({
                        name: "Utilisateur",
                        value: newMessage.author.tag
                    }, {
                        name: "Nombre de messages",
                        value: currentLength
                    }, {
                        name: "Sanction",
                        value: data.massantilink.sanction
                    })
                    .setColor(client.color.replace("#", ""))
                    .setFooter(`ID: ${newMessage.author.id} | ${client.config.footer.text}`)
                    .setTimestamp();

                modLogs.send({ embeds: [embed] });
            }

            // Appliquer la sanction
            switch (data.massantilink.sanction) {
                case "mute":
                    const time = ms("15m");
                    await newMessage.guild.members.fetch(newMessage.author.id).then(member => {
                        member.timeout(time, "Clarity Anti-raid system");
                    });
                    break;
                case "kick":
                    await newMessage.guild.members.fetch(newMessage.author.id).then(member => {
                        member.kick({ reason: "Clarity Anti-raid system" });
                    });
                    break;
                case "ban":
                    await newMessage.guild.members.fetch(newMessage.author.id).then(member => {
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
                        newMessage.author.send({ embeds: [embed] });
                        let warn = client.data.get(`warn_${guildId}_${authorId}`) || [];
                        warn.push({ reason: "Envoi de lien en masse", date: Date.now(), moderator: client.user.id });
                        client.data.set(`warn_${guildId}_${authorId}`, warn);
                    });
                    break;
                case "derank":
                    await newMessage.guild.members.fetch(newMessage.author.id).then(member => {
                        let roles = member.roles.cache.filter((r) => r.id !== newMessage.guild.id);
                        member.roles.set(roles);
                    });
                    break;
                default:
                    break;
            }

            // Appeler la fonction pour supprimer tous les messages restants dans le canal
            await deleteRemainingMessages(newMessage.channel, newMessage.author.id);

        } catch (error) {
            console.error("Une erreur s'est produite lors de la suppression des messages de spam :", error);
        }
    } else {
        // Si la longueur du spam a changé, continuez à attendre
        await waitEnd(client, newMessage);
    }
}

async function deleteRemainingMessages(channel, authorId) {
    try {
        const messagesToDelete = await channel.messages.fetch({ limit: 100 });
        if (messagesToDelete.size > 0) {
const messagesToDeleteByAuthor = messagesToDelete.filter(msg => msg.author.id === authorId);
            if (messagesToDeleteByAuthor.size > 0) {
                await channel.bulkDelete(Array.from(messagesToDeleteByAuthor));
            }
        }
    } catch (error) {
        console.error("Une erreur s'est produite lors de la suppression des messages restants :", error);
    }
}
