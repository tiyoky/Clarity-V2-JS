const Discord = require('discord.js');
const {ActionRowBuilder , ButtonBuilder, EmbedBuilder} = require("discord.js")
const Clarity = require('../../structures/client/index');
module.exports = {
    name: "ready",
      /**
   * 
   * @param {Clarity} client 
   */
    run: async(client) => {
    /*    const now = new Date();
        const timestamp = Math.floor(now.getTime() / 1000);

        const buyerUsers = client.users.cache.filter(u => client.config.creators.includes(u.id));
buyerUsers.forEach(u => {
  u.send({embeds: [
    {
        fields: [{name: `<t:${timestamp}:R>`, value: ">>> __Je viens de démarrer__"}],
        footer: {text: client.config.footer},
        color: client.config.default_color
    }
  ], components: [{
    type: 1,
    components: [{
        type: 2,
        style: 5,
        label: "Support",
        url : `${client.config.support}`,
        emoji: {id: "1046061500072214600"}
    }]

  }]}).catch(e => {});
});*/

    }
}