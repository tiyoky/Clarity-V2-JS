const Discord = require('discord.js');
const Clarity = require('../../structures/client/index');

module.exports = {
    name: 'banner',   
    category: "💻〢Informations",
    aliases: [],
    /**
     *   
     * @param {Clarity} client   
     * @param {Discord.Message} message
     */
    run: async (client, message, args) => {   
        let user = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => null);
        if (!user) {
            user = message.author;
        }

        // Récupérer à nouveau l'utilisateur pour s'assurer que nous avons les données les plus récentes y compris l'écran de fond
        user = await client.users.fetch(user.id, { force: true });

        // Obtenir l'URL de l'écran de fond
        const bannerURL = user.bannerURL({ format: 'png', size:   4096 });

        if (bannerURL) {
            // Créer un embed avec l'image de l'écran de fond
            const embed = new Discord.EmbedBuilder()
                .setColor(client.color.replace('#', ''))
                .setTitle(user.username)
                .setImage(bannerURL);

            // Envoyer l'embed dans le canal
            message.channel.send({ embeds: [embed] });
        } else {
            message.channel.send('Cet utilisateur n\'a pas de banniere.');
        }
    }
};