module.exports = {
  name: "marry",
  description: "Marriez-vous avec quelqu'un!",
  run: async (client, message, args) => {
    try {
      const user = message.mentions.users.first() || client.users.cache.get(args[0]);
      if (!user) {
        return message.reply("Vous devez mentionner la personne avec laquelle vous voulez vous marier. Usage: `!marry @user`");
      }
      if (user.bot) {
        return message.reply("Vous ne pouvez pas vous marier avec un bot.");
      }
      if (message.author.id === user.id) {
        return message.reply("Vous ne pouvez pas vous marier avec vous-même.");
      }

      let dbAuthor = client.data.get(`family_${message.author.id}`) || {
        sister: [],
        brother: [],
        children: [],
        parent: [],
        marry: null,
      };

      let dbUser = client.data.get(`family_${user.id}`) || {
        sister: [],
        brother: [],
        children: [],
        parent: [],
        marry: null,
      };

      // Check if the user and the author are already married
      if (dbAuthor.marry || dbUser.marry) {
        return message.reply(`Vous  êtes déjà marié avec ${client.users.cache.get(dbAuthor.marry || dbUser.marry)}`);
      }

      // Send a message to the user to accept or refuse the marriage proposal
      const sentMessage = await message.channel.send({
        embeds: [{
          author: {
            name: message.author.username,
            icon_url: message.author.displayAvatarURL({ dynamic: true }),
          },
          color: parseInt(client.color.replace("#", ""),   16),
          description: `${message.author.username} vous demande en mariage. Cliquez sur le bouton correspondant pour accepter ou refuser le mariage.`,
          footer: {
            text: client.config.footer.text
          },
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
          sister: [],
          brother: [],
          children: [],
          parent: [],
          marry: null,
        };
        const dbUser = client.data.get(`family_${user.id}`) || {
          sister: [],
          brother: [],
          children: [],
          parent: [],
          marry: null,
        };

        if (interaction.customId === "accepter" + message.id) {
          dbAuthor.marry = user.id;
          dbUser.marry = author.id;
          client.data.set(`family_${author.id}`, dbAuthor);
          client.data.set(`family_${user.id}`, dbUser);
          await interaction.reply({ content: `Vous avez accepté le mariage avec ${author.username}`, ephemeral: true });
          await sentMessage.edit({
            embeds: [{
              author: {
                name: message.author.username,
                icon_url: message.author.displayAvatarURL({ dynamic: true }),
              },
              color: parseInt(client.color.replace("#", ""),   16),
              description: `${message.author.username} : ${user.username} a accepté de se marier avec vous.`,
              footer: {
                text: client.config.footer.text
              },
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
          await interaction.reply({ content: `Vous avez refusé le mariage avec ${author.username}`, ephemeral: true });
          await sentMessage.edit({
            embeds: [{
              author: {
                name: message.author.username,
                icon_url: message.author.displayAvatarURL({ dynamic: true }),
              },
              color: parseInt(client.color.replace("#", ""),   16),
              description: `${message.author.username} : ${user.username} a refusé de se marier avec vous.`,
              footer: {
                text: client.config.footer.text
              },
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
