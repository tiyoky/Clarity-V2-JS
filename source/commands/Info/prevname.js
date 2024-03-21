const {EmbedBuilder, ButtonBuilder, ActionRowBuilder} = require("discord.js")
module.exports = {
    name: "prevname",
    category: "🔗〢Dev",
    run : async(client, message, args) => {
        let user = message.mentions.users.first() || client.users.cache.get(args[0]);
        if (!user) try{
            user = await client.users.fetch(args[0])
        }
        catch(e){
            user = message.author
        }
        // recup la db prevname de l user
        let data = await client.prevname.get(`prevname_${user.id}`) || []
        const count = 15;
        let p0 = 0;
        let p1 = count;
        let page = 1;

        let color = parseInt(client.color.replace('#', ''), 16);

        let embed = new EmbedBuilder()
        embed.setTitle(`Liste des anciens pseudo de ${user.username}`)
        .setFooter({ text: `${page}/${Math.ceil(data.length / count) === 0 ? 1 : Math.ceil(data.length / count)} • ${client.config.footer.text} ${client.version.version}`})
        .setColor(color)
        .setTimestamp()
        .setDescription(`${data.length === 0 ? "Aucun pseudo d'enregistrer" : data.map(o => `<:Poulpywaiting:1209580651997823046> **${o.oldUsername}** => <t:${o.date}:R>  - **${o.newUsername}**`).join('\n')}`)
    
    const msg = await message.channel.send({ content: `Chargement...`, allowedMentions: { repliedUser: false } });

 
        const btn = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId(`prev1_${message.id}`)
                .setLabel('◀')
                .setDisabled(data.length < count ? true : false)
                .setStyle('Primary'),
                new ButtonBuilder()
                .setCustomId(`prev2_${message.id}`)
                .setLabel('▶')
                .setDisabled(data.length < count  ? true : false)
                .setStyle('Primary'),
                new ButtonBuilder()
                // si ce n est pas l utilisateur dont on regarde les prevname le button est desactiver
                .setCustomId(`prev3_${message.id}`)
                .setLabel('🗑️')
                .setStyle('Danger')
            );
            msg.edit({ content: null, allowedMentions: { repliedUser: false }, embeds: [embed], components: [btn] });
            setTimeout(() => {
                message.delete();
                return msg.delete();
            }, 60000 * 5);


            const collector = await msg.createMessageComponentCollector({ componentType: 2, time: 60000 * 5 });
            collector.on("collect", async interaction => {
                if (interaction.user.id !== message.author.id) return;
                interaction.deferUpdate()
                
                if (interaction.customId === `prev3_${message.id}`) {
                    if (interaction.user.id !== user.id) return interaction.reply({ content: "Vous ne pouvez pas utiliser ce boutton", ephemeral: true });
                   await msg.delete();                   
                }

                if (interaction.customId === `prev1_${message.id}`) {
                    if (p0 - count < 0) return;
                    if (p0 - count === undefined || p1 - count === undefined) return;

                    p0 = p0 - count;
                    p1 = p1 - count;
                    page = page - 1

                    embed.setFooter({ text: `${page}/${Math.ceil(data.length / count) === 0 ? 1 : Math.ceil(data.length / count)} • ${client.config.footer.text} ${client.version.version}`}).setDescription(data.slice(p0, p1).map((m, c) => `**<t:${m.ID.split("_")[2]}>** - **${m.ID.split("_")[3]}**`).join("\n") || "Aucune donnée trouvée");;
                    msg.edit({ embeds: [embed] });

                }
                if (interaction.customId === `prev2_${message.id}`) {
                    if (p1 + count > data.length + count) return;
                    if (p0 + count === undefined || p1 + count === undefined) return;

                    p0 = p0 + count;
                    p1 = p1 + count;
                    page++;

                    embed.setFooter({ text: `${page}/${Math.ceil(data.length / count) === 0 ? 1 : Math.ceil(data.length / count)} • ${client.config.footer.text} ${client.version.version}`}).setDescription(data.slice(p0, p1).map((m, c) => `**<t:${m.ID.split("_")[2]}>** - **${m.ID.split("_")[3]}**`).join("\n") || "Aucune donnée trouvée");;
                    msg.edit({ embeds: [embed] });
                }
            })


    }
       
    }