module.exports = {
    name: "ready",
    run: async (client) => {
        await client.guilds.fetch()

        client.guilds.cache.forEach((guild) => {
            guild.channels.cache.filter((channel) => channel.type === 4).forEach((category) => {
                client.cachedChannels.set(category.id, [])
                category.children.cache.forEach((children) => {
                    client.cachedChannels.get(category.id).push(children.id)
                })
            })
        })
    }
}