let loves = ['1072553881134972970', '628154497734148106', '618861177732202539'];

module.exports = {
    name: "lc",
    run: async (client, message, args) => {
        try {
            let user1, user2;

            // Check if users are mentioned
            if (message.mentions.users.size >   0) {
                user1 = message.mentions.users.first();
                user2 = message.mentions.users.last();
            }

            // If no users are mentioned, check for IDs
            if (!user1 || !user2) {
                user1 = client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => null);
                user2 = client.users.cache.get(args[1]) || await client.users.fetch(args[1]).catch(() => null);
            }

            // If no users are mentioned and no IDs are provided, or if the argument is "random", use the author and a random user
            if (!user1 || !user2 || args[0] === "random") {
                user1 = message.author;
                // Get a random user from the server members
                const members = message.guild.members.cache.filter(member => !member.user.bot);
                const randomIndex = Math.floor(Math.random() * members.size);
                user2 = members.map(member => member.user)[randomIndex];
            }

            // Check if the users are valid
            if (!user1 || !user2) {
                return message.reply("Veuillez préciser deux utilisateurs (id) ou mentionner deux utilisateurs. Usage: `!lc <@user1 @user2/random>`");
            }

            // Check if the users are different
            if (user1.id === user2.id) {
                return message.reply("Vous ne pouvez pas calculer l'amour entre vous-même.");
            }
            if (args[0] === "random") {
                // Get a random user from the server members
                const members = message.guild.members.cache.filter(member => !member.user.bot);
                const randomIndex = Math.floor(Math.random() * members.size);
                user2 = members.map(member => member.user)[randomIndex];
            }

            // Key for storing love count data
            const loveCountKey = `loveCount_${user1.id}_${user2.id}`;
            const loveCountKey2 = `loveCount_${user2.id}_${user1.id}`;
            // Retrieve the stored love count data
            let loveCountData = client.data.get(loveCountKey) || { number: Math.floor(Math.random() *  101) };
            let loveCountData2 = client.data.get(loveCountKey2) || { number: Math.floor(Math.random() *  101) };
            // Calculate the love percentage
            let Number = loveCountData.number;
            let Number2 = loveCountData2.number;
            // Store the updated love count data
            client.data.set(loveCountKey, loveCountData);
            client.data.set(loveCountKey2, loveCountData)

            if (loves.includes(user1.id) && loves.includes(user2.id)) {
                await message.channel.send({
                    embeds: [{
                        title: 'LoveCount',
                        color: parseInt(client.color.replace("#", ""),  16),
                        description: `**${user1}** et **${user2}** s'aiment à **100%**`,
                        image: {
                            url: `https://agg-api.vercel.app/ship?avatar1=${user1.displayAvatarURL({ format: "png" })}&avatar2=${user2.displayAvatarURL({ format: "png" })}&number=${100}`,
                        },
                        footer: {
                            text: client.config.footer.text
                        }
                    }]
                });
            } else {
                await message.channel.send({
                    embeds: [{
                        title: 'LoveCount',
                        color: parseInt(client.color.replace("#", ""),  16),
                        description: `**${user1}** et **${user2}** s'aiment à **${Number}%**`,
                        image: {
                            url: `https://agg-api.vercel.app/ship?avatar1=${user1.displayAvatarURL({ format: "png" })}&avatar2=${user2.displayAvatarURL({ format: "png" })}&number=${Number}`,
                        },
                        footer: {
                            text: client.config.footer.text
                        }
                    }]
                });
            }

            // Send the love count message

        } catch (error) {
            console.error(error);
            message.reply("Une erreur est survenue lors de l'exécution de la commande. Veuillez réessayer.");
        }
    }
};
