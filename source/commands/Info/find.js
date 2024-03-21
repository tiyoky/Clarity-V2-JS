const Discord = require('discord.js');
const Clarity = require('../../structures/client/index');

module.exports = {
    name: 'find', 
   category: "💻〢Informations",
    /**
     * 
     * @param {Clarity} client 
     * @param {Discord.Message} message
     */
    run: async (client, message) => {
     let color =  parseInt(client.color.replace('#', ''), 16);
        let embed = new Discord.EmbedBuilder()
        embed.setColor(color);
        embed.setTitle("Recherche vocal du membre: " + member.user.username);
        embed.addFields({
            name: `Le membre est en vocal:`,
            value: `${member.voice.channel
                ? `${member.voice.channel.id}`
                : `Le membre n'est pas en vocal.`}`,
            inline: true
        })
        embed.setFooter(client.config.footer)
        message.channel.send({ embeds: [embed] })

    

    }
}


