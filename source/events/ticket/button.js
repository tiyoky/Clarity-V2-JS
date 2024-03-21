const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const Discord = require('discord.js');

module.exports = {
    name: "interactionCreate",
    run: async (client, interaction) => {
        try {
            if (!interaction.isButton()) return;
            if (interaction.customId.startsWith('ticket_')) {
                const color = await parseInt(client.color.replace('#', ''), 16);
                await interaction.deferReply({ ephemeral: true })
                const id = interaction.customId.split('_')[1];
                const db = await client?.data2.get(`ticket_${interaction.guild.id}`);
                if (!db) return;

                const option = db.option.find(option => option.value === id);
                if (!option) return;


                const tickeruser = await client.data2.get(`ticket_user_${interaction.guild.id}`) || [];
                const resul = tickeruser.find(ticket => ticket.author === interaction.user.id);
                
                if (resul && tickeruser.length >= db?.maxticket) {
                    return await interaction.editReply({ content: `Vous avez déjà atteint le nombre maximal de tickets ouverts !`, ephemeral: true });
                }

                let permissionOverwrites = [
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [Discord.PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.user,
                        allow: [
                            Discord.PermissionFlagsBits.SendMessages,
                            Discord.PermissionFlagsBits.ViewChannel,
                            Discord.PermissionFlagsBits.AttachFiles,
                            Discord.PermissionFlagsBits.AddReactions
                        ]
                    }
                ];

                if (option.acess) {
                    const permissionObject = {
                        id: option.acess,
                        allow: [
                            Discord.PermissionFlagsBits.SendMessages,
                            Discord.PermissionFlagsBits.ViewChannel,
                            Discord.PermissionFlagsBits.AttachFiles,
                            Discord.PermissionFlagsBits.AddReactions
                        ]
                    };
                    permissionOverwrites.push(permissionObject);
                }


                const channel = await interaction.guild.channels.create({
                    parent: client.channels.cache.get(option.categorie) ? option.categorie : null,
                    name: option.text + '-' + interaction.user.username,
                    type: 0,
                    permissionOverwrites: permissionOverwrites,
                });

                await interaction.editReply({ content: `Ticket open <#${channel?.id}>` });
                const embed = new Discord.EmbedBuilder()
                    .setColor(color)
                    .setFooter(client.config.footer)
                    .setDescription(option.message)
                    .setTitle('Ticket ouvert par ' + interaction.user.username)

                const idunique = code(15)
                const button = new ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                        .setLabel('Fermer le ticket')
                        .setStyle(4)
                        .setEmoji('🔒')
                        .setCustomId("close_" + idunique)
                )

                if (db.claimbutton) {
                    button.addComponents(
                        new Discord.ButtonBuilder()
                            .setLabel('Récupère le ticket')
                            .setStyle(2)
                            .setEmoji('🔐')
                            .setCustomId("claim_" + idunique)
                    )
                }
                channel.send({
                    embeds: [embed],
                    content: option.mention ? `<@&${option.mention}>` : null,
                    components: [button]
                })
                tickeruser.push({
                    salon: channel.id,
                    author: interaction.user.id,
                    date: Date.now(),
                    id: idunique,
                    option: option.value,
                    claim: null,
                })
                await client.data2.set(`ticket_user_${interaction.guild.id}`, tickeruser)
            }
        } catch (error) {
            console.error(error);
            interaction.editReply({ content: 'Une erreur est survenue.', flags: 64 });
        }
    }
};


function code(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
}