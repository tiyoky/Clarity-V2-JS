const { EmbedBuilder } = require('discord.js')
module.exports = {
    name: 'voiceStateUpdate',
    run: async(client, oldState, newState) => {
        const { member, guild } = oldState;
        const channel = newState.channelId;
        if (!channel) return;
        let db = client.data.get(`voicelogs_${guild.id}`);
        if (!db) return;
        const chan = member.guild.channels.cache.get(db);
        if (!chan) return;
        let deafType = newState.serverDeaf ? 'deafen' : newState.selfDeaf ? 'self-deafen' : 'undeafen';
        let muteType = newState.serverMute ? 'mute' : newState.selfMute ? 'self-mute' : 'unmute';
        // Fetch the audit logs
        let logs = (await guild.fetchAuditLogs({limit: 1,type: 24})).entries.first();
        let { executor, target} = logs;
 
        // Check if the target of the log entry is the member who had their mute or deafen status changed
        if (target.id === member.id) {
            // serverdeaf
            if (oldState.serverDeaf !== newState.serverDeaf) {

                const embed = new EmbedBuilder()
                    .setAuthor({name: `${member.user.username}`, iconURL: member.user.displayAvatarURL({dynamic: true})})
                    .setTitle(newState.channel.name)
                    .setColor(parseInt(client.color.replace("#", ""), 16))
                    .addFields({name: 'Deafen', value: `${member} a été ${deafType}`})
                    .setTimestamp()
                    .setFooter({text: client.config.footer.text})

                    if (executor) {
                        embed.addFields({name: 'Executor', value: `${executor.username} (\`${executor.id}\`)`})
                        embed.setThumbnail(executor.displayAvatarURL({dynamic: true}))
                    }
                if (chan)   chan.send({
                   embeds: [embed]
                })
            }
            // selfdeaf
            if (oldState.selfDeaf !== newState.selfDeaf) {

              
                const embed = new EmbedBuilder()
                    .setAuthor({name: `${member.user.username}`, iconURL: member.user.displayAvatarURL({dynamic: true})})
                    .setTitle(newState.channel.name)
                    .setColor(parseInt(client.color.replace("#", ""), 16))
                    .addFields({name: 'Deafen', value: `${member} a été ${deafType}`})
                    .setTimestamp()
                    .setFooter({text: client.config.footer.text})

                    if (executor) {
                        embed.setThumbnail(executor.displayAvatarURL({dynamic: true}))
                    }
                if (chan)   chan.send({
                   embeds: [embed]
                })
            }
            // servermute
            if (oldState.serverMute !== newState.serverMute) {
               
                const embed = new EmbedBuilder()
                    .setAuthor({name: `${member.user.username}`, iconURL: member.user.displayAvatarURL({dynamic: true})})
                    .setTitle(newState.channel.name)
                    .setColor(parseInt(client.color.replace("#", ""), 16))
                    .addFields({name: 'Mute', value: `${member} a été ${muteType}`})
                    .setTimestamp()
                    .setFooter({text: client.config.footer.text})

                    if (executor) {
                        embed.addFields({name: 'Executor', value: `${executor.username} (\`${executor.id}\`)`})
                        embed.setThumbnail(executor.displayAvatarURL({dynamic: true}))
                    }
                if (chan)   chan.send({
                   embeds: [embed]
                })
            }
            // selfmute
            if (oldState.selfMute !== newState.selfMute) {
                const embed = new EmbedBuilder()
                .setAuthor({name: `${member.user.username}`, iconURL: member.user.displayAvatarURL({dynamic: true})})
                .setTitle(newState.channel.name)
                .setColor(parseInt(client.color.replace("#", ""), 16))
                .addFields({name: 'Mute', value: `${member} a été ${muteType}`})
                .setTimestamp()
                .setFooter({text: client.config.footer.text})

                if (executor) {
                    embed.setThumbnail(executor.displayAvatarURL({dynamic: true}))
                }
            if (chan)   chan.send({
               embeds: [embed]
            })
            }
        }
    }
 }