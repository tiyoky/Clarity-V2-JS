const {EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder , ButtonBuilder} = require('discord.js')
const moment = require("moment");
module.exports = {
    name: 'clarity',
    category: 'Info',
    description: 'clarity info command',
    usage: 'clarity',
    run: async (client, message, args) => {
        let msg = await message.channel.send({content: 'chargement du module en cours . . .'})
        await update(client, message , msg)
}
}

async function update(client, message , msg) {
    const ownerClari = await client.config.ownerClari || [];
    const respClari = await client.config.respClari || [];
    const marketClari = await client.config.marketClari || [];
    const designClari = await client.config.designClari || [];
    const techClari = await client.config.techClari || [];

    const embed = new EmbedBuilder()
        .setTitle('Clarity')
        .setColor(parseInt(client.color.replace("#", ""), 16))
        .setDescription(`Choisissez quel partie de l equipe Clarity vous souhaitez voir`)
        .setImage(client.user.displayAvatarURL({dynamic: true}))
        .setTimestamp()
        .setFooter(client.config.footer)
        

    const row = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('clarity' + message.id)
                .setPlaceholder('Choisissez une option')
                .addOptions([
                    {
                        label: 'Owner',
                        description: 'Info sur les Owners',
                        value: 'owner',
                        emoji: '👑'
                    }, {
                        label: 'Responsable',
                        description: 'Info sur les Responsables',
                        value: 'resp',
                        emoji: '👨‍💼'
                    }, {
                        label: "Equipe Marketing",
                        description: 'Info sur l equipe Marketing',
                        value: 'market',
                        emoji: '💼'
                    }, {
                        label: "Equipe Design",
                        description: 'Info sur l equipe Design',
                        value: 'design',
                        emoji: '🎨'
                    }, {
                        label: "Technicien",
                        description: 'Info sur les techniciens',
                        value: 'tech',
                        emoji: '🔮'
                    }
                ]),
        )

        const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setStyle('Link')
                .setURL(client.config.support)
                .setLabel('Support')
                .setEmoji('❔')
        )




   msg.edit({content: null ,embeds: [embed], components: [row]})

    
    // create new collector
    const filter = (i) => i.user.id === message.author.id

    let collector = message.channel.createMessageComponentCollector(filter, { time: 90000 * 10 * 3 })


collector.on("collect", async (i) => {
    if (i.customId === 'clarity' + message.id) {
        if (i.values[0] === 'owner') {
          const ownerFields = ownerClari.map((owner, index) => {
            const user = client.users.cache.get(owner);
            return {
                name: `[${index +  1}] ${user ? user.username : owner}`,
                value: user ? `Nom D'affichage: ${user.displayName}\nNom d'utilisateur: ${user.username}\nID: ${user.id}\nCompte creé le: ${moment(user.createdAt).format("DD/MM/YYYY")}` : owner
            }
          })

 

          const select = new StringSelectMenuBuilder()
          .setPlaceholder("Choisissez un owner")
          .setCustomId("owner" + message.id)
          .addOptions(ownerClari.map(owner => {
            return {
              label: `${client.users.cache.get(owner)?.username}` || owner,
              value: `${owner}`
            }
          }))
        const ownerRow = new ActionRowBuilder()
            .addComponents(select)

            const embed = new EmbedBuilder()
                .setTitle('Clarity - Owner')
                .setColor(parseInt(client.color.replace("#", ""), 16))
                .setTimestamp()
                .setFooter(client.config.footer)
                .addFields(...ownerFields);

                await i.update({ embeds: [embed] , components: [row, ownerRow, row2] })
            }

        else if (i.values[0] === 'resp') {

            const respFields = respClari.map((resp, index) => {
                const user = client.users.cache.get(resp)
                return {
                    name: `[${index +  1}] ${user ? user.username : resp}`,
                value: user ? `Nom D'affichage: ${user.displayName}\nNom d'utilisateur: ${user.username}\nID: ${user.id}\nCompte creé le: ${moment(user.createdAt).format("DD/MM/YYYY")}` : resp
                }
            })

            // si les fields sont vides retourne un field : equipe vide
            
            if (respFields.length === 0) {
                respFields.push({ name: 'Equipe Vide', value: 'Aucun Responsable' })
            }

            const select = new StringSelectMenuBuilder()
            .setPlaceholder("Choisissez un Responsable")
            .setCustomId("resp" + message.id)

            if (respClari.length > 0) {
                select.addOptions(respClari.map(resp => {
                    return {
                      label: `${client.users.cache.get(resp)?.username}` || resp,
                      value: `${resp}`
                    }
                }))
            } else {
                select.addOptions([{
                    label: 'Aucun Responsable',
                    value: 'Aucun Responsable'
                }])
            }
         
         

            
            const respRow = new ActionRowBuilder()
                .addComponents(select)

     

            const embed = new EmbedBuilder()
                .setTitle('Clarity - Responsable')
                .setColor(parseInt(client.color.replace("#", ""), 16))
                .setTimestamp()
                .setFooter(client.config.footer)
                .addFields(...respFields);
                await i.update({ embeds: [embed], components: [row, respRow, row2] })
        }

        else if (i.values[0] === 'market'){

            const marketFields = marketClari.map((market, index) => {
                const user = client.users.cache.get(market)
                
                return {
                    name: `[${index +  1}] ${user ? user.username : market}`,
                value: user ? `Nom D'affichage: ${user.displayName}\nNom d'utilisateur: ${user.username}\nID: ${user.id}\nCompte creé le: ${moment(user.createdAt).format("DD/MM/YYYY")}` : market
                }
            })

            // si les fields sont vides retourne un field : equipe vide

            if (marketFields.length === 0) {
                marketFields.push({ name: 'Equipe Vide', value: 'Aucun membre dans l\'equipe Marketing' })
            }

            const select = new StringSelectMenuBuilder()
            .setPlaceholder("Choisissez un membre de l equipe Marketing")
            .setCustomId("market" + message.id)
            if(marketClari.length > 0) {
                select.addOptions(marketClari.map(market => {
                    return {
                      label: `${client.users.cache.get(market)?.username}` || market,
                      value: `${market}`
                    }
                }))
            } else {
                select.addOptions([{
                    label: 'Aucun membre dans l\'equipe Marketing',
                    value: 'Aucun membre dans l\'equipe Marketing'
                }])
            }
           
            
            const marketRow = new ActionRowBuilder()
                .addComponents(select)

            const embed = new EmbedBuilder()
                .setTitle('Clarity - Equipe Marketing')
                .setColor(parseInt(client.color.replace("#", ""), 16))
                .setTimestamp()
                .setFooter(client.config.footer)
                .addFields(...marketFields);
                await i.update({ embeds: [embed], components: [row, marketRow, row2] })
        }

        else if (i.values[0] === 'design') {

            const designFields = designClari.map((design, index) => {
                const user = client.users.cache.get(design)
                
                return {
                    name: `[${index +  1}] ${user ? user.username : design}`,
                value: user ? `Nom D'affichage: ${user.displayName}\nNom d'utilisateur: ${user.username}\nID: ${user.id}\nCompte creé le: ${moment(user.createdAt).format("DD/MM/YYYY")}` : design
                }
            })


            // si les fields sont vides retourne un field : equipe vide
            if (designFields.length === 0) {
                designFields.push({ name: 'Equipe Vide', value: 'Aucun Designer' })
            }



            const select = new StringSelectMenuBuilder()
            .setPlaceholder("Choisissez un membre de l'equipe Design")
            .setCustomId("design" + message.id)
           
            if(designClari.length > 0) {
                select.addOptions(designClari.map(design => {
                    return {
                      label: `${client.users.cache.get(design)?.username}` || design,
                      value: `${design}`
                    }
                }))
            } else {
                select.addOptions([{
                    label: 'Aucun membre dans l\'equipe Design',
                    value: 'Aucun membre dans l\'equipe Design'
                }])
            }

            const designRow = new ActionRowBuilder()
                .addComponents(select)

            const embed = new EmbedBuilder()
                .setTitle('Clarity - Equipe Design')
                .setColor(parseInt(client.color.replace("#", ""), 16))
                .setTimestamp()
                .setFooter(client.config.footer)
                .addFields(...designFields);
                await i.update({ embeds: [embed], components: [row, designRow, row2] })
        } else if (i.values[0] === 'tech') {

            const techFields = techClari.map((tech, index) => {
                const user = client.users.cache.get(tech)
                return {
                    name: `[${index +  1}] ${user ? user.username : tech}`,
                value: user ? `Nom D'affichage: ${user.displayName}\nNom d'utilisateur: ${user.username}\nID: ${user.id}\nCompte creé le: ${moment(user.createdAt).format("DD/MM/YYYY")}` : tech
                }
            })


        
             // si les fields sont vides retourne un field : equipe vide
            if (techFields.length === 0) {
                techFields.push({ name: 'Equipe Vide', value: 'Aucun Technicien' })
            }


            const select = new StringSelectMenuBuilder()
            .setPlaceholder("Choisissez un Technicien")
            .setCustomId("tech" + message.id)
         
            if(techClari.length > 0) {
                select.addOptions(techClari.map(tech => {
                    return {
                      label: `${client.users.cache.get(tech)?.username}` || tech,
                      value: `${tech}`
                    }
                }))
            } else {
                select.addOptions([{
                    label: 'Aucun Technicien',
                    value: 'Aucun Technicien'
                }])
            }

            const techRow = new ActionRowBuilder()
                .addComponents(select)
            const embed = new EmbedBuilder()
                .setTitle('Clarity - Technicien')
                .setColor(parseInt(client.color.replace("#", ""), 16))
                .setTimestamp()
                .setFooter(client.config.footer)
                .addFields(...techFields);
                await i.update({ embeds: [embed], components: [row, techRow, row2] })
        }


        }
})
    
client.on("interactionCreate", async (i) => {
    if (!i.isStringSelectMenu()) return;

    if (i.customId === "owner" + message.id) {
        const owner = ownerClari.find((d) => d === i.values[0]);
        if (!owner) return i.deferUpdate().catch(()=>{});

        const ownerUser = await client.users.fetch(owner);
        const member = message.guild.members.cache.get(owner);

        if (message.guild.members.cache.has(ownerUser.id)) {
            let status = member && member.presence && member.presence.status ? member.presence.status : 'offline';
            switch (status) {
                case 'online':
                    status = '🟢';
                    break;
                case 'idle':
                    status = '🌙';
                    break;
                case 'dnd':
                    status = '⛔';
                    break;
                default:
                    status = '⚫';
            }

            let statusperso = member && member.presence && member.presence.status !== 'offline' ? member.presence.activities[0]?.state || "Aucune activité" : "Aucune activité";
            const fields = [
                { name: "Nom d'affichage", value: ownerUser.displayName },
                { name: "Nom d'utilisateur", value: ownerUser.username },
                { name: "ID", value: ownerUser.id },
                { name: "Avatar", value: `[Cliquez ici](${ownerUser.displayAvatarURL({ dynamic: true })})` },
                { name: "Compte cree le", value: moment(ownerUser.createdAt).format("DD/MM/YYYY") },
            ];
    
            const embed = new EmbedBuilder()
                .setColor(parseInt(client.color.replace("#", ""), 16))
                .setTimestamp()
                .setFooter(client.config.footer)
                .addFields(...fields)
                .setThumbnail(ownerUser.displayAvatarURL({ dynamic: true }))

                // si le membre a un status l ajoute en field
                if (member?.presence?.status !== "offline") {
                    embed.addFields({ name: "Status", value: status + " " + statusperso })
                }
    
            await i.update({ embeds: [embed] });
        } else {
            const fields = [
                { name: "Nom d'affichage", value: ownerUser.displayName },
                { name: "Nom d'utilisateur", value: ownerUser.username },
                { name: "ID", value: ownerUser.id },
                { name: "Avatar", value: `[Cliquez ici](${ownerUser.displayAvatarURL({ dynamic: true })})` },
                { name: "Compte cree le", value: moment(ownerUser.createdAt).format("DD/MM/YYYY") }
            ];
    
            const embed = new EmbedBuilder()
                .setColor(parseInt(client.color.replace("#", ""), 16))
                .setTimestamp()
                .setFooter(client.config.footer)
                .addFields(...fields)
                .setThumbnail(ownerUser.displayAvatarURL({ dynamic: true }));
    
            await i.update({ embeds: [embed] });
        }
       
    }

    if (i.customId === "design" + message.id) {
        const design = designClari.find((d) => d === i.values[0]);
        if (!design) return i.deferUpdate().catch(()=>{});

        const designUser = await client.users.fetch(design);

        const member = message.guild.members.cache.get(design);
        if (message.guild.members.cache.has(designUser.id)) {
            let status = member && member.presence && member.presence.status ? member.presence.status : 'offline';
            switch (status) {
                case 'online':
                    status = '🟢';
                    break;
                case 'idle':
                    status = '🌙';
                    break;
                case 'dnd':
                    status = '⛔';
                    break;
                default:
                    status = '⚫';
            }

            let statusperso = member && member.presence && member.presence.status !== 'offline' ? member.presence.activities[0]?.state || "Aucune activité" : "Aucune activité";
            const fields = [
                { name: "Nom d'affichage", value: designUser.displayName },
                { name: "Nom d'utilisateur", value: designUser.username },
                { name: "ID", value: designUser.id },
                { name: "Avatar", value: `[Cliquez ici](${designUser.displayAvatarURL({ dynamic: true })})` },
                { name: "Compte cree le", value: moment(designUser.createdAt).format("DD/MM/YYYY") }
            ];
            const embed = new EmbedBuilder()
            .setColor(parseInt(client.color.replace("#", ""), 16))
            .setTimestamp()
            .setFooter(client.config.footer)
            .addFields(...fields)
            .setAuthor({ name: designUser.username, iconURL: designUser.displayAvatarURL({ dynamic: true }) })
    .setThumbnail(designUser.displayAvatarURL({ dynamic: true }))
    .setImage(designUser.displayAvatarURL({ dynamic: true, size: 512 }))
            .setTitle("Clarity Equipe Design")

            
                // si le membre a un status l ajoute en field
                if (member?.presence?.status !== "offline") {
                    embed.addFields({ name: "Status", value: status + " " + statusperso })
                }
            await i.update({ embeds: [embed] });
        } else {
            const fields = [
                { name: "Nom d'affichage", value: designUser.displayName },
                { name: "Nom d'utilisateur", value: designUser.username },
                { name: "ID", value: designUser.id },
                { name: "Avatar", value: `[Cliquez ici](${designUser.displayAvatarURL({ dynamic: true })})` },
                { name: "Compte cree le", value: moment(designUser.createdAt).format("DD/MM/YYYY") }
            ];
            const embed = new EmbedBuilder()
            .setColor(parseInt(client.color.replace("#", ""), 16))
            .setTimestamp()
            .setFooter(client.config.footer)
            .addFields(...fields)
            .setAuthor({ name: designUser.username, iconURL: designUser.displayAvatarURL({ dynamic: true }) })
    .setThumbnail(designUser.displayAvatarURL({ dynamic: true }))
    .setImage(designUser.displayAvatarURL({ dynamic: true, size: 512 }))
            .setTitle("Clarity Equipe Design")
            await i.update({ embeds: [embed] });
        }
 

       
    }

    if (i.customId === "tech" + message.id) {
        const tech = techClari.find((d) => d === i.values[0]);
        if (!tech) return i.deferUpdate().catch(()=>{});

        const techUser = await client.users.fetch(tech);

        const member = message.guild.members.cache.get(tech);

        if (message.guild.members.cache.has(techUser.id)) {
            let status = member && member.presence && member.presence.status ? member.presence.status : 'offline';
            switch (status) {
                case 'online':
                    status = '🟢';
                    break;
                case 'idle':
                    status = '🌙';
                    break;
                case 'dnd':
                    status = '⛔';
                    break;
                default:
                    status = '⚫';
            }

            let statusperso = member && member.presence && member.presence.status !== 'offline' ? member.presence.activities[0]?.state || "Aucune activité" : "Aucune activité";
            const fields = [
                { name: "Nom d'affichage", value: techUser.displayName },
                { name: "Nom d'utilisateur", value: techUser.username },
                { name: "ID", value: techUser.id },
                { name: "Avatar", value: `[Cliquez ici](${techUser.displayAvatarURL({ dynamic: true })})` },
                { name: "Compte cree le", value: moment(techUser.createdAt).format("DD/MM/YYYY") }
            ];
    
            const embed = new EmbedBuilder()
                .setColor(parseInt(client.color.replace("#", ""), 16))
                .setTimestamp()
                .setFooter(client.config.footer)
                .addFields(...fields)
                .setAuthor({ name: techUser.username, iconURL: techUser.displayAvatarURL({ dynamic: true }) })
        .setThumbnail(techUser.displayAvatarURL({ dynamic: true }))
        .setImage(techUser.displayAvatarURL({ dynamic: true, size: 512 }))
                .setTitle("Clarity Technicien")

                
                // si le membre a un status l ajoute en field
                if (member?.presence?.status !== "offline") {
                    embed.addFields({ name: "Status", value: status + " " + statusperso })
                }
                await i.update({ embeds: [embed] });
        } else {
            const fields = [
                { name: "Nom d'affichage", value: techUser.displayName },
                { name: "Nom d'utilisateur", value: techUser.username },
                { name: "ID", value: techUser.id },
                { name: "Avatar", value: `[Cliquez ici](${techUser.displayAvatarURL({ dynamic: true })})` },
                { name: "Compte cree le", value: moment(techUser.createdAt).format("DD/MM/YYYY") }
            ];
    
            const embed = new EmbedBuilder()
                .setColor(parseInt(client.color.replace("#", ""), 16))
                .setTimestamp()
                .setFooter(client.config.footer)
                .addFields(...fields)
                .setAuthor({ name: techUser.username, iconURL: techUser.displayAvatarURL({ dynamic: true }) })
        .setThumbnail(techUser.displayAvatarURL({ dynamic: true }))
        .setImage(techUser.displayAvatarURL({ dynamic: true, size: 512 }))
                .setTitle("Clarity Technicien")
                await i.update({ embeds: [embed] });
        }
       
    }

    if (i.customId === "resp" + message.id) {
        const resp = respClari.find((d) => d === i.values[0]);
        if (!resp) return i.deferUpdate().catch(()=>{});

        const respUser = await client.users.fetch(resp);

        const member = message.guild.members.cache.get(resp);
        if (message.guild.members.cache.has(respUser.id)) {
            let status = member && member.presence && member.presence.status ? member.presence.status : 'offline';
            switch (status) {
                case 'online':
                    status = '🟢';
                    break;
                case 'idle':
                    status = '🌙';
                    break;
                case 'dnd':
                    status = '⛔';
                    break;
                default:
                    status = '⚫';
            }

            let statusperso = member && member.presence && member.presence.status !== 'offline' ? member.presence.activities[0]?.state || "Aucune activité" : "Aucune activité";
            const fields = [
                { name: "Nom d'affichage", value: respUser.displayName },
                { name: "Nom d'utilisateur", value: respUser.username },
                { name: "ID", value: respUser.id },
                { name: "Avatar", value: `[Cliquez ici](${respUser.displayAvatarURL({ dynamic: true })})` },
                { name: "Compte cree le", value: moment(respUser.createdAt).format("DD/MM/YYYY") }
            ]
    
            const embed = new EmbedBuilder()
                .setColor(parseInt(client.color.replace("#", ""), 16))
                .setTimestamp()
                .setFooter(client.config.footer)
                .addFields(...fields)
              
                .setAuthor({ name: respUser.username, iconURL: respUser.displayAvatarURL({ dynamic: true }) })
        .setThumbnail(respUser.displayAvatarURL({ dynamic: true }))
        .setImage(respUser.displayAvatarURL({ dynamic: true, size: 512 }))
                .setTitle("Clarity Responsable")

                
                // si le membre a un status l ajoute en field
                if (member?.presence?.status !== "offline") {
                    embed.addFields({ name: "Status", value: status + " " + statusperso })
                }
                await i.update({ embeds: [embed] });
        } else {
            const fields = [
                { name: "Nom d'affichage", value: respUser.displayName },
                { name: "Nom d'utilisateur", value: respUser.username },
                { name: "ID", value: respUser.id },
                { name: "Avatar", value: `[Cliquez ici](${respUser.displayAvatarURL({ dynamic: true })})` },
                { name: "Compte cree le", value: moment(respUser.createdAt).format("DD/MM/YYYY") }
            ]
    
            const embed = new EmbedBuilder()
                .setColor(parseInt(client.color.replace("#", ""), 16))
                .setTimestamp()
                .setFooter(client.config.footer)
                .addFields(...fields)
                .setAuthor({ name: respUser.username, iconURL: respUser.displayAvatarURL({ dynamic: true }) })
        .setThumbnail(respUser.displayAvatarURL({ dynamic: true }))
        .setImage(respUser.displayAvatarURL({ dynamic: true, size: 512 }))
                .setTitle("Clarity Responsable")
                await i.update({ embeds: [embed] });
        }
    }
})
}