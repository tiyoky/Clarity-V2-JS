const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'interactionCreate',
    run: async (client, interaction) => {
        if (!interaction.isButton() && !interaction.isModalSubmit()) return;
        if (interaction.customId.startsWith('newconfess')) {
            const modal = new ModalBuilder()
            .setCustomId('confess')
            .setTitle('Votre Confession');
    
        const confessInput = new TextInputBuilder()
            .setCustomId('confessInput')
            .setLabel('Quel est votre confession ?')
            .setStyle(TextInputStyle.Paragraph);
    
        const anonymityInput = new TextInputBuilder()
            .setCustomId('anonymityInput')
            .setLabel('Voulez-vous rester anonyme ? (Oui/Non)')
            .setStyle(TextInputStyle.Short);
    
        const actionRow = new ActionRowBuilder().addComponents(confessInput);

        const actionRow2 = new ActionRowBuilder().addComponents(anonymityInput);
    
        modal.addComponents(actionRow, actionRow2);
    
        await interaction.showModal(modal);
        }

        if (interaction.customId.startsWith('confess')) {
            interaction.deferUpdate();
            const confess = interaction.fields.getTextInputValue('confessInput')
            const anon = interaction.fields.getTextInputValue('anonymityInput')

            if (anon !== 'Oui' && anon !== 'oui' && anon !== 'Non' && anon !== 'non') {
                return
            }

            let confNum = client.data.get(`confNum_${interaction.guild.id}`)
            if (!confNum) confNum = 0
            client.data.set(`confNum_${interaction.guild.id}`, confNum + 1)
            let num = confNum
            let channel = client.channels.cache.get(client.data.get(`confession_${interaction.guild.id}`))
            const embed = new EmbedBuilder()
                .setTitle('Nouvelle Confession')
                .setDescription(confess)
                .setColor(parseInt(client.color.replace("#", ""), 16))
                .setFooter({  text: `Confession n°${num}` + ' | ' + client.user.username })

                if (anon === 'non') {
                    embed.setAuthor({ name: `${interaction.user.username}`});
                    embed.setImage(`${interaction.user.displayAvatarURL({ dynamic: true })}`);
                }

                channel.send({ embeds: [embed] })

            
                let channell = client.channels.cache.get(client.data.get(`syslogs_${interaction.guild.id}`))
                channell.send({ embeds: [{
                    title: 'Nouvelle Confession',
                    description: `${confess} || Par ${interaction.user.username} (${interaction.user.id})`,
                    color: parseInt(client.color.replace("#", ""), 16),
                    footer: {
                        text: `Confession n°${num}` + ' | ' + client.user.username
                    }
                }] })
        }
    }
}