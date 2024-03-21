module.exports = { 
    name: "stats",
    aliases: ['vc'],
    description: "Affiche les stats du serveur",
    run: async (client, message, args) => {
        let msg = await message.channel.send({content: 'chargement du module en cours . . .'})
        await embed(client, message, msg);
    }
}
async function embed(client, message, msg){
    let color = parseInt(client.color.replace('#', ''), 16);
    let muted = message.guild.members.cache.filter(m => m.voice.selfMute && !m.voice.selfDeaf).size
    let deaf = message.guild.members.cache.filter(m => m.voice.selfDeaf ||  m.voice.serverDeaf).size
    let streaming = message.guild.members.cache.filter(m => m.voice.streaming).size
    let video = message.guild.members.cache.filter(m => m.voice.selfVideo).size
    let total = message.guild.members.cache.filter(m => m.voice.channel !== null).size;
    let vocPlusActif = message.guild.channels.cache.filter(channel => channel.type === 2).sort((a, b) => b.members.size - a.members.size).first()
    let vocPlusActifCount = message.guild.members.cache.filter(member => member.voice.channelId === vocPlusActif.id).size;
    let count = message.guild.memberCount
    await msg.edit({content: null, embeds: [{
        color: color,
        title: `**__Statistiques ${message.guild.name}__**`,
            fields: [{
                name: 'Membres sur le serveur',
                value: `\`${count}\``,
                inline: true
            }, {
                name: 'Membres en ligne',
                value: `\`${message.guild.members.cache.filter(m => m.presence && m.presence.status && m.presence.status !== 'offline').size}/${count}\``,
                inline: true
            }, {
                name: 'Membre en vocal',
                value: `\`${total}/${count}\``,
                inline: true
            }, {
                name: 'Nombre de boost',
                value: `\`${message.guild.premiumSubscriptionCount || '0'}\``,
                inline: true
            },{
                name: 'Membre mute micro en vocal',
                value: `\`${muted}/${count}\``,
                inline: true
            }, {
                name: 'Membre mute casque en vocal',
                value: `\`${deaf}/${count}\``,
                inline: true
            }, {
                name: 'Membre en stream',
                value: `\`${streaming}/${count}\``,
                inline: true
            }, {
                name: 'Membre en caméra',
                value: `\`${video}/${count}\``,
                inline: true
            }, {
                name: 'Salon Vocal Le plus actif',
                value: `\`${vocPlusActif.name} - ${vocPlusActifCount}/${count}\``,
                inline: true
            }],
        thumbnail: {
            url: message.guild.iconURL({dynamic: true})
        },
        footer: {
            text: message.guild.name + ' #Statistiques',
            icon_url: message.guild.iconURL({dynamic: true})
        }
    }]})
}