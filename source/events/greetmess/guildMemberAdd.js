module.exports = {
    name: "guildMemberAdd",
    run: async(client, member) => {
        if (member.user) {
            if (!member.guild) return;
            let data = await client.settings.get(`settings_${client.user.id}`) || {
                status: false, 
                channels: []
            }

            if (!data || data.status === false || !data.channels || data.channels.length === 0) return;
            for (const channelId of data.channels) {
                const channel = member.guild.channels.cache.get(channelId);
                if (channel && channel.isTextBased()) {
                    channel.send({ content: `<@${member.id}>` })
                        .then(message => setTimeout(() => message.delete(), 1000))
                        .catch(() => false);
                }
            }
        }
    }
}