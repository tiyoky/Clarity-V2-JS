const { EmbedBuilder ,ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, } = require("discord.js");

module.exports = {
    name: "boostembed",
    aliases: ["boostembed"],
    category: "📝〢Gestion",
    description: "Configurer l'embed de boost",
    run: async(client, message, args) => {
        const isOwn = await client.db.oneOrNone(`SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`, [message.author.id]);
        if (!isOwn) return message.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande" });

        let data = client.embeds.get(`boostembed_${message.guild.id}`) || {
            boostemb: {
                title: "Embed Boost",
                description: "Configurer l'embed de boost",
                color: client.color,
                footer: {
                    text: client.config.footer,
                    icon_url: client.user.displayAvatarURL()
                },
                thumbnail: {
                    url: client.user.displayAvatarURL()
                },
                author: {
                    name: client.user.username,
                    icon_url: client.user.displayAvatarURL()
                },
                image: {
                    url: client.user.displayAvatarURL()
                }
            }
        }

        const titleModal = new ModalBuilder()
            .setTitle("Configurer le titre de l'embed")
            .setCustomId(`boostembed_title_${message.id}`)

        const titleInput = new TextInputBuilder()
            .setCustomId("titleInput")
            .setLabel("Titre")
            .setStyle(TextInputStyle.Short)

        const descriptionModal = new ModalBuilder()
            .setTitle("Configurer la description de l'embed")
            .setCustomId(`boostembed_description_${message.id}`)

        const descriptionInput = new TextInputBuilder()
            .setCustomId("descriptionInput")
            .setLabel("Description")
            .setStyle(TextInputStyle.Paragraph)

             const colorModal = new ModalBuilder()
            .setTitle("Configurer la couleur de l'embed")
            .setCustomId(`boostembed_color_${message.id}`)
            
        const colorInput = new TextInputBuilder()
            .setCustomId("colorInput")
            .setLabel("Couleur")
            .setStyle(TextInputStyle.Short)

             const footerModal = new ModalBuilder()
          .setTitle("Configurer le footer de l'embed")
          .setCustomId(`boostembed_footer_${message.id}`)
          

          const footerTextInput = new TextInputBuilder()
            .setCustomId("footerTextInput")
            .setLabel("Texte du footer")
            .setStyle(TextInputStyle.Short)

            const footerIconInput = new TextInputBuilder()
            .setCustomId("footerIconInput")
            .setLabel("Icone du footer")
            .setStyle(TextInputStyle.Paragraph)

            const thumbnailModal = new ModalBuilder()
            .setTitle("Configurer le thumbnail de l'embed")
            .setCustomId(`boostembed_thumbnail_${message.id}`)

            const thumbnailInput = new TextInputBuilder()
            .setCustomId("thumbnailInput")
            .setLabel("Thumbnail")
            .setStyle(TextInputStyle.Paragraph)

            const authorModal = new ModalBuilder()
            .setTitle("Configurer l'author de l'embed")
            .setCustomId(`boostembed_author_${message.id}`)

            const authorNameInput = new TextInputBuilder()
            .setCustomId("authorNameInput")
            .setLabel("Nom de l'author")
            .setStyle(TextInputStyle.Short)

            const authorIconInput = new TextInputBuilder()
            .setCustomId("authorIconInput")
            .setLabel("Icone de l'author")
            .setStyle(TextInputStyle.Paragraph)

            const imageModal = new ModalBuilder()
            .setTitle("Configurer l'image de l'embed")
            .setCustomId(`boostembed_image_${message.id}`)

            const imageInput = new TextInputBuilder()
            .setCustomId("imageInput")
            .setLabel("Image")
            .setStyle(TextInputStyle.Paragraph)

            const titleRow = new ActionRowBuilder().addComponents(titleInput)
            const descriptionRow = new ActionRowBuilder().addComponents(descriptionInput)
            const colorRow = new ActionRowBuilder().addComponents(colorInput)
            const footerRow = new ActionRowBuilder().addComponents(footerTextInput)
            const footerIconRow = new ActionRowBuilder().addComponents(footerIconInput)
            const thumbnailRow = new ActionRowBuilder().addComponents(thumbnailInput)
            const authorRow = new ActionRowBuilder().addComponents(authorNameInput)
            const authorIconRow = new ActionRowBuilder().addComponents(authorIconInput)
            const imageRow = new ActionRowBuilder().addComponents(imageInput)
            titleModal.addComponents(titleRow)
            descriptionModal.addComponents(descriptionRow)
            colorModal.addComponents(colorRow)
            imageModal.addComponents(imageRow)
            footerModal.addComponents(footerRow ,footerIconRow)
            thumbnailModal.addComponents(thumbnailRow)
            authorModal.addComponents(authorRow, authorIconRow)
            

        const baseEmb = new EmbedBuilder()
            .setTitle(data.boostemb.title ? data.boostemb.title : "Embed Boost")
            .setDescription(data.boostemb.description ? data.boostemb.description : "Configurer l'embed de boost")
            .setColor(data.boostemb.color ? data.boostemb.color : client.color)
            .setFooter({ text: data.boostemb.footer.text, iconURL: data.boostemb.footer.icon_url })
            .setThumbnail(data.boostemb.thumbnail.url ? data.boostemb.thumbnail.url : null)
            .setAuthor({ name: data.boostemb.author.name , iconURL: data.boostemb.author.icon_url })
            .setImage(data.boostemb.image.url ? data.boostemb.image.url : null)


            const configEmb = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId(`boostembed_${message.id}`)
                .setPlaceholder("Configurer l'embed de boost")
                .addOptions([
                    {
                    //    titre de l embed
                        label: "Configurer le titre de l'embed",
                        description: "Configurer le titre de l'embed",
                        value: "title",
                    }, {
                        //    description de l embed
                        label: "Configurer la description de l'embed",
                        description: "Configurer la description de l'embed",
                        value: "description",
                    } , {
                        //    couleur de l embed
                        label: "Configurer la couleur de l'embed",
                        description: "Configurer la couleur de l'embed",
                        value: "color",
                    } , {
                        //    footer de l embed
                        label: "Configurer le footer de l'embed",
                        description: "Configurer le footer de l'embed",
                        value: "footer",
                    } , {
                        //    thumbnail de l embed
                        label: "Configurer le thumbnail de l'embed",
                        description: "Configurer le thumbnail de l'embed",
                        value: "thumbnail",
                    } , {
                        //    author de l embed
                        label: "Configurer l'author de l'embed",
                        description: "Configurer l'author de l'embed",
                        value: "author",
                    } , {
                        //    image de l embed
                        label: "Configurer l'image de l'embed",
                        description: "Configurer l'image de l'embed",
                        value: "image",
                    }
                ])
            )

            const fieldsButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId(`resetboostembed_${message.id}`)
                .setEmoji("1162113683535704064")
                .setStyle("Danger")
            )

            
         


            let msg = await message.channel.send({
                embeds: [baseEmb],
                components: [configEmb, fieldsButtons]
            })

            const collector = msg.createMessageComponentCollector({
                time: 60000 * 5 
            })

            collector.on("collect", async(i) => {
                if (!i.customId.includes(message.id)) return;
                if (i.user.id !== message.author.id) return i.reply({ content: 'Vous n\'avez pas la permission d\'utiliser cette interaction', ephemeral: true });
                if (i.customId === `boostembed_${message.id}`) {
                    if (i.values[0] === "title") {
                        await i.showModal(titleModal)
                    }
                }
                if (i.customId === `boostembed_title_${message.id}`) {
                    data.boostemb.title = i.values[0]
                    client.embeds.set(`boostembed_${message.guild.id}`, data)
                    // edit the title of the baseEmbed
                    baseEmb.setTitle(data.boostemb.title)
                    await i.update({ embeds: [baseEmb] })
                }
            })

    }
}