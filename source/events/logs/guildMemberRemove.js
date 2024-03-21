module.exports = {
    name: 'guildMemberRemove',
    run: async(client, member) => {
        const {guild} = member;
        if(!guild) return;

        let logs = client.data.get(`joinsleave_${guild.id}`);
        if(!logs) return;

        let chan = guild.channels.cache.get(logs);
        if(!chan) return;

        chan.send({
            embeds: [{
                author: {name: `${member.user.username}`, icon_url: member.user.displayAvatarURL({dynamic: true})},
                thumbnail: {url: member.user.displayAvatarURL({dynamic: true})},
                title: guild.name,
                color: parseInt(client.color.replace("#", ""),  16),
                description: `${member.user.username} a quitté ${guild.name}. Nous sommes maintenant ${guild.memberCount} membres.`,
                timestamp: new Date(),
                footer: {
                    text: client.config.footer.text
                }
            }]
        });
    }
};
