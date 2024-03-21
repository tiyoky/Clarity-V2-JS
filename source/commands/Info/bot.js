module.exports = {
    name: "mybot",
    description: "Obtien un lien d'invite pour votre bot",
    category: "💻〢Informations",
    run: async(client, message) => {


        let msg = await message.channel.send({
            embeds: [{
                title: "Votre bot",
                description: `[${client.user.username}](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)`,
                color: parseInt(client.color.replace("#", ""), 16),
                footer: client.config.footer,
                timestamp: new Date()
            }]
        });



    }
}