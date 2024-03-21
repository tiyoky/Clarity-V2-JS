const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "messageCreate",
    run: async (client, message) => {
        if (message.author.bot) return;
        if (message.channel.type !== 0) return; // Vérifiez le type de canal
        if (message.content.startsWith(client.config.prefix)) return;
        if (message.content.length > 2000) {
            message.delete();
            return message.channel.send({
                content: "Votre message est trop long"
            });
        }

        let db = await client.data.get(`count_${message.guild.id}`) || {
            channels: [],
            number: 0
        }

        // Système de comptage : si le canal est défini pour le comptage
        if (db.channels.includes(message.channel.id)) {
            if (isNaN(message.content)) {
                message.delete();
                return message.channel.send("Veuillez envoyer un nombre.");
            }

            // Assurons-nous que db.number est initialisé
            if (db.number === undefined) {
                db.number = 0;
            }

            const expectedNumber = db.number + 1;
            const sentNumber = parseInt(message.content);

            // Vérifiez si le nombre envoyé est le prochain attendu
            if (sentNumber !== expectedNumber) {
                const embed = new EmbedBuilder()
                    .setTitle("Compteur")
                    .setDescription(`Le prochain nombre attendu est : ${expectedNumber}`)
                    .setColor(client.color.replace("#", ""), 16)
                    .setFooter(client.config.footer);

                message.channel.send({
                    embeds: [embed]
                }).then(msg => {
                    setTimeout(() => {
                        msg.delete();
                    }, 5000);
                });

                return;
            }

            // Si le nombre est correct, ajoutez-le à la liste des nombres et mettez à jour la base de données
            db.number = sentNumber;
            await client.data.set(`count_${message.guild.id}`, db);

            const nextNumber = expectedNumber + 1;
            const nextEmbed = new EmbedBuilder()
                .setTitle("Compteur")
                .setDescription(`Le prochain nombre attendu est : ${nextNumber}`)
                .setColor(client.color.replace("#", ""), 16)
                .setFooter(client.config.footer);

            message.channel.send({
                embeds: [nextEmbed]
            }).then(msg => {
                setTimeout(() => {
                    msg.delete();
                }, 5000);
            });
        }
    }
};
