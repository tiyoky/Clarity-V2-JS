
const { EmbedBuilder , ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder} = require('discord.js')
const ms = require('ms')
module.exports = {
    name: "constent",
    aliases: ["constentmsg", "constents"],
    category: "info",
    description: "Affiche la liste des constents msg / en ajoute",
    usage: "",
    run: async(client, message, args) => {
        if (client.config.devs.includes(message.author.id)) {
            let msg = await message.channel.send({content: 'Module en cours de chargement. . .'})
            await update(client, message, msg)
        } else {
            const isOwn = await client.db.oneOrNone(
                `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
                [message.author.id]
            );
            if (!isOwn) {
                return message.reply({
                    content: "Vous n'avez pas la permission d'utiliser cette commande",
                });
            }
            let msg = await message.channel.send({content: 'Module en cours de chargement. . .'})
            await update(client, message, msg)
        }
    }
}

async function update(client, message, msg) {
    let color = parseInt(client.color.replace('#', ''), 16);
    let db = client.data.get((`constentmsg_${message.guild.id}`)) || {
        message: [
            {
                content: null,
                channel: null,
                time: null
            }
        ],
    }

    const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle('Liste des constents msg')
    .setFooter({text: `${client.config.text} | ${client.version.version}`})
    .setTimestamp()

    if (db.message.length === 0) {
        embed.setDescription('Aucun constent msg')
    } else if (db.message.length > 0){
        if (db.message.length > 25) {
            db.message = db.message.slice(0, 25)
        }

        embed.setDescription(`Liste des constents msg pour le serveur ${message.guild.name} : \n\n Pour ajouter un constent msg, cliquez sur le bouton ➕ \n Pour éditer un constent msg, cliquez sur le bouton ✏️ \n Pour supprimer un constent msg, cliquez sur le bouton ❌ \n Pour rafraîchir la liste, cliquez sur le bouton 🔄 \n Pour supprimer tous les constents msg, cliquez sur le bouton 🗑️\n\n Liste des constents msg : \n\n ${db.message.length} constent msg(s) trouvé(s) pour le serveur ${message.guild.name} : \n\n`)

        // Add a new field for each message in the database with the content, channel and time if it's not null or 'Aucun' if it's null
        for (let i =  0; i < db.message.length; i++) {
            const timeDisplay = db.message[i].time ? ms(db.message[i].time) : 'Aucun';
            embed.addFields({
                name: `[${i +  1}]`,
                value: `Contenu: ${db.message[i].content ? db.message[i].content : 'Aucun'}\nChannel: <#${db.message[i].channel ? db.message[i].channel : 'Aucun'}>\nTemps: ${timeDisplay}`
            });
        }
    }




    const row = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
        .setCustomId('add' + message.id)
            .setEmoji('➕')
        .setStyle(1),
        new ButtonBuilder()
            .setCustomId('edit' + message.id)
            .setEmoji('✏️')
            .setStyle(2),
        new ButtonBuilder()
        .setCustomId('delete' + message.id)
            .setEmoji('❌')
        .setStyle(4),
        new ButtonBuilder()
.setCustomId('refresh' + message.id)
            .setEmoji('🔄')
        .setStyle(3),
        new ButtonBuilder()
        .setCustomId('resetAll' + message.id)
            .setEmoji('🗑️')
        .setStyle(4)
    )

    msg.edit({
        content: null,
        embeds: [embed],
        components: [
            row
        ]
    })
    const collector = msg.createMessageComponentCollector({ componentType: 2 })
let question;
    collector.on('collect', async (interaction) => {
        if (interaction.user.id !== message.author.id) return interaction.reply({ content: "Vous ne pouvez pas configurer via un panel qui n'est pas le vôtre", ephemeral: true });
        if (interaction.customId === 'add' + message.id) {
            await interaction.deferUpdate()
            await add(client, message, msg)
        }

        if (interaction.customId === 'edit' + message.id) {
            await interaction.deferUpdate()
            await edit(client, message, msg)
        }

        if (interaction.customId === 'delete' + message.id) {
            await interaction.deferUpdate()
            await deleteMsg(client, message, msg)
        }

        if (interaction.customId === 'refresh' + message.id) {
            await interaction.deferUpdate()
            await update(client, message, msg)
        }

        if (interaction.customId === 'resetAll' + message.id) {
            await interaction.deferUpdate()
            client.data.delete(`constentmsg_${message.guild.id}`)
            await update(client, message, msg)
        }


    })


}

async function add(client, message, msg) {
    let color = parseInt(client.color.replace('#', ''), 16);
    let db = client.data.get((`constentmsg_${message.guild.id}`)) || {
        message: [
            {
                content: null,
                channel: null,
                time: null
            }
        ],
    }
    let embed = new EmbedBuilder()
    .setColor(color)
    .setTitle('Ajouter un constent msg')
    .setDescription('Veuillez choisir ce que vous voulez ajouter')
    .setTimestamp()
    .setFooter({text: `${client.config.text} | ${client.version.version}`})
    .setTimestamp()

    const row = new ActionRowBuilder()
    .addComponents(
       new StringSelectMenuBuilder()
           .setCustomId('constentcreate' + message.id)
              .setPlaceholder('Création du constent msg')
              .addOptions({
                  label: 'Contenu',
                  value: 'content'
              },
                {
                    label: 'Channel',
                    value: 'channel'
                },
                {
                    label: 'Temps',
                    value: 'time'
                }
                )
    )

    const row2 = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('confirm' + message.id)
            .setEmoji('✅')
            .setStyle(3),
        new ButtonBuilder()
            .setCustomId('reset' + message.id)
            .setEmoji('🔄')
            .setStyle(2)
        ,
        new ButtonBuilder()
        .setCustomId('cancel' + message.id)
        .setEmoji('❌')
        .setStyle(4)

    )
    msg.edit({
        content: null,
        embeds: [embed],
        components: [
            row,
            row2
        ]
    })
    const collector = msg.createMessageComponentCollector()
    let question;
    collector.on('collect', async (interaction) => {
        if (interaction.user.id !== message.author.id) return interaction.reply({ content: "Vous ne pouvez pas configurer via un panel qui n'est pas le vôtre", ephemeral: true });
        await interaction.deferUpdate()
        if (interaction.customId === 'constentcreate' + message.id) {

            if (interaction.values[0] === 'content') {
                interaction.deferUpdate();
                question = await message.channel.send({ content: "Quel est le contenu du message ?", ephemeral: true });
                const filter = m => m.author.id === message.author.id;
                message.channel.awaitMessages({ filter, max: 1, time: 1000 * 60, errors: ['time'] }).then(async (cld) => {
                    cld.first().delete();
                    question.delete();
                    let content = cld.first().content;
                    db.message.push({content: content})
                    await add(client, message, msg)
                })
            }
            if (interaction.values[0] === 'channel') {
                interaction.deferUpdate();
                question = await message.channel.send({ content: "Quel est le channel du message ?", ephemeral: true });
                const filter = m => m.author.id === message.author.id;
                message.channel.awaitMessages({ filter, max: 1, time: 1000 * 60, errors: ['time'] }).then(async (cld) => {
                    cld.first().delete();
                    question.delete();
                    let channel = client.channels.cache.get(cld.first().content) || message.guild.channels.cache.get(cld.first().content) || message.mentions.channels.first() || await message.guild.channels.fetch(cld.first().content).catch(() => null);
                    db.message.push({channel: channel})
                    await add(client, message, msg)
                })
            }
            if (interaction.values[0] === 'time') {
                interaction.deferUpdate();
                question = await message.channel.send({ content: "Quel est le temps du message ?", ephemeral: true });
                const filter = m => m.author.id === message.author.id;
                message.channel.awaitMessages({ filter, max: 1, time: 1000 * 60, errors: ['time'] }).then(async (cld) => {
                    cld.first().delete();
                    question.delete();
                    let time = ms(cld.first().content);
                    db.message.push({time: time})
                    await add(client, message, msg)
                })
            }
        }
        if (interaction.customId === 'confirm' + message.id) {
            client.data.set(`constentmsg_${message.guild.id}`, db)
            await update(client, message, msg)
        }
        if (interaction.customId === 'reset' + message.id) {
            db.message = [
                {
                    content: null,
                    channel: null,
                    time: null
                }
            ]
            await add(client, message, msg)
        }
        if (interaction.customId === 'cancel' + message.id) {
            await update(client, message, msg)
        }
    })
}