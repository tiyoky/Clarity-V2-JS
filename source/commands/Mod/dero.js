module.exports = {
    name: "dero",
    aliases: [],
    category: "📝〢Moderation",
    description:"Masque tous les salon du serveur",
    perm: 1,
    run: async (client, message, args, prefix) => {
        if (!args[0]) {
            message.guild.channels.cache.forEach(channel => channel.permissionOverwrites.edit(message.guild.id, { VIEW_CHANNEL: false }));
            message.channel.send({ content: "Toutes les dérogations ont été mises à jour." }).then(m => setTimeout(() => m.delete().catch(() => false), 5000));
        } else if (args[0].toLowerCase() === "off") {
            message.guild.channels.cache.forEach(channel => channel.permissionOverwrites.edit(message.guild.id, { VIEW_CHANNEL: null }));
            message.channel.send({ content: "Toutes les dérogations ont été mises à jour." }).then(m => setTimeout(() => m.delete().catch(() => false), 5000));;
        }
    }
}