module.exports = { 
    name : 'tos',
    description : 'Get the Terms of Service.',
    run: async(client, message) => {
        let color =  parseInt(client.color, 16);
        message.channel.send({embeds: [{
            title: 'Terms of Service',
            color: color,
            description: "Merci à tous de prendre en compte les T.O.S de Discord, pour cela, cliquez ci-dessous https://discordapp.com/terms",
            timestamp: new Date(),
            footer: client.config.footer
        }]})
    }
}