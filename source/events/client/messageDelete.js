module.exports = {
    name: "messageDelete",
    run: async(client, message) => {
        try  {
            if (!message.partial) {
                client.snipes.set(message.channel.id, {
                    content: message.content,
                    author: message.author,
                    image: message.attachments.first() ? message.attachments.first().proxyURL : null,
                    embeds: message.embeds || [],
                    timestamp: message.createdTimestamp,
                    date: new Date()
                  })
            }
        } catch(e) {
            console.error("Erreur :",e)
        }
      
    }
}