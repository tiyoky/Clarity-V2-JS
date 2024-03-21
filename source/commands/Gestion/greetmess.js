const { EmbedBuilder , ButtonBuilder, ActionRowBuilder, ChannelSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: "greetmess",
    description: "Permet de configurer le greetmess",
    aliases : ["greet"],
    category: "Gestion",
    run: async (client, message, args) => {
        const isOwn = await client.db.oneOrNone(`SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,[message.author.id]);
        if (!isOwn) return message.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande" });
          
        let msg = await message.channel.send({content: 'Chargement du module en cours . . .'});

       
        let data = await client.settings.get(`settings_${client.user.id}`) || {
            status: false, channels: []
        }

        const embed = new EmbedBuilder()
            .setTitle('Configuration du greetmess')
            .setColor(parseInt(client.color.replace('#', ''), 16))
            .addFields(
            {
                name: 'Statut',
                value: data.status ? '<:Poulpyactif:1216368664773660692>' : '<:poulpynepasderanger:1216368662554869832>',
            },
            {
                name: 'Salons',
                value: data.channels.map(channel => `<#${channel}>`).join(', ') || 'Aucun',
            })
            .setTimestamp()
            .setFooter({ text: `${client.config.footer.text} ${client.version.version}`, iconURL: client.user.displayAvatarURL() })
            
        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('status' + message.id)
                .setEmoji('1209580651997823046')
                .setStyle('Secondary')
        )


    const row = new ActionRowBuilder().addComponents(
        new ChannelSelectMenuBuilder()
            .setCustomId('select' + message.id)
            .setPlaceholder('Aucun')
            .setMinValues(1)
            .addChannelTypes(0)
        )
        
    msg.edit({content: null, embeds: [embed], components: [row1, row]})
    const collector = message.channel.createMessageComponentCollector({ time: 60000*10*3 })

    collector.on('collect', async i => {
        if (!i.customId.includes(message.id)) return;
        if (i.user.id !== message.author.id) return i.reply({ content: 'Vous n\'avez pas la permission d\'utiliser cette interaction', ephemeral: true });
        i.deferUpdate().catch(() => false);
            
        let data = await client.settings.get(`settings_${client.user.id}`) || {
            status: false, channels: []
        };
        
        if (i.customId === 'status' + message.id) {
                if(data.hasOwnProperty('status')){
                    const currentStatus = data.status;
                    const newStatus = !currentStatus;
                    data.status = newStatus;
                    await client.settings.set(`settings_${client.user.id}`, data);
                    const status = data?.status === true ? "Le status a été activé avec succès" : "Le status a été désactivé avec succès";
                    const reply = await message.reply({ content: status});
                    setTimeout(async () => {
                        await reply.delete();
                    }, 2000);
                    let color = parseInt(client.color.replace('#', ''), 16);
                    const embed = new EmbedBuilder()
                        .setTitle('Configuration du greetmess')
                        .setColor(color)
                        .addFields({
                            name: 'Statut',
                            value: data.status ? '<:Poulpyactif:1216368664773660692>' : '<:poulpynepasderanger:1216368662554869832>',
                        },{
                            name: 'Salons',
                            value: data.channels.map(channel => `<#${channel}>`).join(', ') || 'Aucun',
                        })
                        .setTimestamp()
                        .setFooter({ text: `${client.config.footer.text} ${client.version.version}`, iconURL: client.user.displayAvatarURL() });
                    msg.edit({content: null, embeds: [embed], components: [row1, row]});
                }
            } else if (i.customId === 'select' + message.id) {
                const channels = i.values;
                data.channels = channels;
                await client.settings.set(`settings_${client.user.id}`, data);
                let color = parseInt(client.color.replace('#', ''), 16);
                const embed = new EmbedBuilder()
                    .setTitle('Configuration du greetmess')
                    .setColor(color)
                    .addFields({
                        name: 'Statut',
                        value: data.status ? '<:Poulpyactif:1216368664773660692>' : '<:poulpynepasderanger:1216368662554869832>',
                    },{
                        name: 'Salons',
                        value: data.channels.map(channel => `<#${channel}>`).join(', ') || 'Aucun',
                    })
                    .setTimestamp()
                    .setFooter({ text: `${client.config.footer.text} ${client.version.version}`, iconURL: client.user.displayAvatarURL() });
                msg.edit({content: null, embeds: [embed], components: [row1, row]});
            }
  
        });
        
    }
}

