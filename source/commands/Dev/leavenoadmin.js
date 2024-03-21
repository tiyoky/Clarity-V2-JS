const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'leavenoadmin',
    run: async (client, message, args) => {
        if (!client.config.devs.includes(message.author.id)) return message.reply({
            content: "Vous n'avez pas la permission pour faire cette commande"
        });

        if (client.config.devs.includes(message.author.id)) {
            try {
                let leavePromises = [];
                client.guilds.cache.each(guild => {
                    if (!guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator)) {
                        leavePromises.push(guild.leave().then(() => {
                            console.log(`Left guild: ${guild.name} due to lack of administrator permissions.`);
                        }).catch(error => {
                            console.error(`Error leaving guild: ${guild.name}`, error);
                        }));
                    }
                });
                await Promise.all(leavePromises);
                let guildsLeft = leavePromises.length;
                message.reply({
                    content: `Le bot a quitté ${guildsLeft} serveurs où il n'avait pas les permissions d'administrateur.`
                });
            } catch (error) {
                console.error('Error in leaveNoAdmin command:', error);
            }
        }
    }
};
