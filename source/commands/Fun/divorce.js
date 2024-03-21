module.exports = {
    name: 'divorce',
    run: async(client, message, args) => {
        const user = client.users.cache.get(message.mentions.users.first().id) || client.users.cache.get(args[0]);
        if (!user) {
            return message.reply("vous devez mentionner la personne avec laquelle vous voulez divorcer.");
        }
        if (user.bot) {
            return message.reply("vous ne pouvez pas vous divorcer avec un bot.");
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

        // Check if the user and the author are married
        if (!dbAuthor.marry || dbAuthor.marry !== user.id) {
            return message.reply("vous n'êtes pas marié avec cette personne.");
        }

        // Reset the marriage status for both the author and the mentioned user
        dbAuthor.marry = null;
        dbUser.marry = null;
        client.data.set(`family_${message.author.id}`, dbAuthor);
        client.data.set(`family_${user.id}`, dbUser);

        // Send a notification to the mentioned user that they have been divorced
        await user.send({
            embeds: [{
                color:  3447003,
                title: "Divorce",
                description: message.author.username + ' vient de divorcer avec vous',
                footer: {
                    text: "Divorce",
                },
            }],
        });

        // Confirm the divorce to the author
        return message.reply("vous avez bien divorcé.");
    }
};
