module.exports = {
    name: 'messageCreate',
    run: async(client, message) => {
        if (message.author.bot) return;
        if (message.channel.type === "DM") return;

        const db = client.data2.get(`bltext_${message.guild.id}`) || {
            users: []
        }

        if (db.users.includes(message.author.id)) {
            message.delete();
            message.channel.send(`:x: ${message.author} tu es interdit de parler sur ce serveur`)
        }
    }
}