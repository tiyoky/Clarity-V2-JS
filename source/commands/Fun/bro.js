module.exports = {
    name: "bro",
    run: async (client, message, args) => {
        try {
            const user = client.users.cache.get(message.mentions.users.first().id) || client.users.cache.get(args[0]);
            if (!user) {
                return message.reply("Vous devez mentionner la personne avec laquelle vous voulez devenir frère/sœur. Usage: `!bro @user`");
            }
            if (user.bot) {
                return message.reply("Vous ne pouvez pas devenir frère/sœur avec un bot.");
            }
            if (message.author.id === user.id) {
                return message.reply("Vous ne pouvez pas devenir frère/sœur avec vous-même.");
            }

            let dbAuthor = client.data.get(`family_${message.author.id}`) || {
                brosis: [],
                children: [],
                parent: [],
                marry: null,
            };

            let dbUser = client.data.get(`family_${user.id}`) || {
                brosis: [],
                children: [],
                parent: [],
                marry: null,
            };

            // Check if user is already in the same family
            if ([...dbAuthor.brosis, ...dbAuthor.children, ...dbAuthor.parent].includes(user.id)) {
                return message.reply(`${user.username} est déjà dans la même famille que vous.`);
            }

            // Send a message to the user to accept or refuse the sibling request
            const sentMessage = await message.channel.send({
                embeds: [{
                    author: {
                        name: message.author.username,
                        icon_url: message.author.displayAvatarURL({ dynamic: true }),
                    },
                    color: parseInt(client.color.replace("#", ""),   16),
                    description: `${message.author.username} vous demande en tant que frère/sœur. Cliquez sur le bouton correspondant pour accepter ou refuser la fratrie.`,
                    footer: client.config.footer,
                }],
                components: [{
                    type:   1,
                    components: [
                        {
                            type:   2,
                            label: "Accepter",
                            style:   3,
                            custom_id: "accepter" + message.id,
                        },
                        {
                            type:   2,
                            label: "Refuser",
                            style:   4,
                            custom_id: "refuser" + message.id,
                        },
                    ],
                }],
            });

            // Collect the user's response
            const collector = sentMessage.createMessageComponentCollector({ componentType:   2 });
            collector.on("collect", async (interaction) => {
                const author = message.author;
                const dbAuthor = client.data.get(`family_${author.id}`) || {
                    brosis: [],
                    children: [],
                    parent: [],
                    marry: null,
                };
                const dbUser = client.data.get(`family_${user.id}`) || {
                    brosis: [],
                    children: [],
                    parent: [],
                    marry: null,
                };

                if (interaction.customId === "accepter" + message.id) {
                    dbAuthor.brosis.push(user.id);
                    dbUser.brosis.push(author.id);
                    client.data.set(`family_${author.id}`, dbAuthor);
                    client.data.set(`family_${user.id}`, dbUser);
                    await interaction.reply({ content: `Vous avez accepté d'être frère/sœur avec ${author.username}`, ephemeral: true });
                    await sentMessage.edit({
                        embeds: [{
                            author: {
                                name: user.username,
                                icon_url: message.author.displayAvatarURL({ dynamic: true }),
                            },
                            color: parseInt(client.color.replace("#", ""),   16),
                            description: `${message.author.username} : ${user.username} a accepté d'être frère/sœur avec vous.`,
                            footer: client.config.footer,
                        }],
                        components: [{
                            type:   1,
                            components: [
                                {
                                    type:   2,
                                    label: "Accepter",
                                    style:   3,
                                    custom_id: "accepter" + message.id,
                                    disabled: true
                                },
                                {
                                    type:   2,
                                    label: "Refuser",
                                    style:   4,
                                    custom_id: "refuser" + message.id,
                                    disabled: true
                                },
                            ],
                        }],
                    });
                } else if (interaction.customId === "refuser" + message.id) {
                    await interaction.reply({ content: `Vous avez refusé d'être frère/sœur avec ${author.username}`, ephemeral: true });
                    await sentMessage.edit({
                        embeds: [{
                            author: {
                                name: message.author.username,
                                icon_url: message.author.displayAvatarURL({ dynamic: true }),
                            },
                            color: parseInt(client.color.replace("#", ""),   16),
                            description: `${message.author.username} : ${user.username} a refusé d'être frère/sœur avec vous.`,
                            footer: client.config.footer,
                        }],
                        components: [{
                            type:   1,
                            components: [
                                {
                                    type:   2,
                                    label: "Accepter",
                                    style:   3,
                                    custom_id: "accepter" + message.id,
                                    disabled: true
                                },
                                {
                                    type:   2,
                                    label: "Refuser",
                                    style:   4,
                                    custom_id: "refuser" + message.id,
                                    disabled: true
                                },
                            ],
                        }],
                    });
                }

                collector.stop();
            });
        } catch (error) {
            console.error(error);
            message.reply("Une erreur est survenue lors de l'exécution de la commande. Veuillez réessayer.");
        }
    }
};
