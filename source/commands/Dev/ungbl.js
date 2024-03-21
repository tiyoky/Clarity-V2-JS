module.exports = {
    name: "ungbl",
    category: "🔗〢Dev",
    run: async (client, message, args) => {
        // Vérifie si l'utilisateur qui exécute la commande est un développeur autorisé
        if (!client.config.devs.includes(message.author.id)) {
            return message.reply({
                content: "Vous n'avez pas la permission pour faire cette commande"
            });
        }

        // Vérifie si un utilisateur a été mentionné ou un ID a été fourni
        const user = message.mentions.members.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => { });
        if (!user) {
            return message.reply({ content: "Veuillez mentionner un utilisateur ou fournir son ID." });
        }

        // Vérifie si l'utilisateur mentionné est déjà dans la liste noire globale
        const isInGbl = await client.db.oneOrNone(
            `SELECT  1 FROM clarity_gblacklist WHERE user_id = $1`,
            [user.id]
        );
        if (!isInGbl) {
            return message.reply({ content: `${user.tag} n'est pas dans la liste noire globale.` });
        }

        // Retire l'utilisateur de la liste noire globale
        await client.db.none(
            `DELETE FROM clarity_gblacklist WHERE user_id = $1`,
            [user.id]
        ).then(() => {
            // get all guilds
            const guilds = client.guilds.cache.map(guild => guild.name);
            // unban the members from all guilds
            for (const guildName of guilds) {
                const guild = client.guilds.cache.find(guild => guild.name === guildName);
                //  unban the member
                guild.members.unban(user.id);
            }
            message.reply({ content: `${user.tag} a été retiré de la liste noire globale.` });
        }).catch((error) => {
            console.error("Erreur lors de la mise à jour de la DB : ", error);
            message.reply({
                content: "Une erreur s'est produite lors de la suppression de la liste noire globale.",
            });
        });

    }
}
