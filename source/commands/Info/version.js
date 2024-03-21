module.exports = {
    name: "version",
    run: async (client, message, args) => {
        message.channel.send({embeds: [{
            color: parseInt(client.color.replace("#", ""), 16),
            title: "Version",
            description: "Version actuelle du bot:" + " " + `\`${client.version.version}\``
        }]})
    }
}