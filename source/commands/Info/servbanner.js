module.exports = {
    name: "servbanner",
    description: "Permet de recuperer la banniere d'un serveur",
    run: async(client, message, args) => {
        if (client.config.devs?.includes(message.author.id)) {
            let ss = client.guilds.cache.get(args[0]) || client.guilds.fetch(args[0])
            if (ss) {
                message.channel.send(ss.bannerURL() ? ss.bannerURL() : "Ce serveur n'a pas de banniere")
            }
        } else {
            const isOwn = await client.db.oneOrNone(
                `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
                [message.author.id]
            );
            if (!isOwn) {
                return message.reply({
                    content: "Vous n'avez pas la permission d'utiliser cette commande",
                });
            }
            let ss = client.guilds.cache.get(args[0]) || client.guilds.fetch(args[0])
            if (ss) {
                message.channel.send(ss.bannerURL() ? ss.bannerURL() : "Ce serveur n'a pas de banniere")
            }
        }
    }
}