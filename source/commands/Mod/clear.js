module.exports = {
    name: "clear",
    aliases: ["purge"],
    category: "📝〢Moderation",
    perm: 1,
    run: async(client, message, args) => {
        if (!args[0]){
            const fetched = await message.channel.messages.fetch({ limit: parseInt(99) });
            await message.channel.bulkDelete(fetched, true).catch(() => false);
            
            message.channel.send({content : `J'ai supprimé 99 message(s)`});
        }
        else if (message.mentions.users.first()){
            const fetched = await message.channel.messages.fetch();
            const messages = fetched.filter(m => m.author.id === message.mentions.users.first().id)
            await message.channel.bulkDelete(messages, true).catch(() => false);
        }
        else if (args[0].endsWith('m')) {
            const minutes = Number(args[0].slice(0, -1));
            if (isNaN(minutes)) return message.reply('Veuillez fournir un temps valide en minutes.');
                
            const timeLimit = minutes * 60 * 1000;
            const currentTime = Date.now();
            
            const messages = await message.channel.messages.fetch({ limit: 100 }).catch(() => false)
            const messagesToDelete = messages.filter(m => currentTime - m.createdTimestamp <= timeLimit);
            const deletedMessages = await message.channel.bulkDelete(messagesToDelete).catch(() => false)
            
            message.channel.send(`Succès, ${deletedMessages.size} messages ont été supprimés. Ces messages avaient été envoyés il y a ${minutes} minutes ou moins.`);
        } else if (args[0]) {
            const fetched = await message.channel.messages.fetch({ limit: parseInt(args[0]) || 99 });
            const messagesToDelete = fetched.filter(msg => Date.now() - msg.createdTimestamp < 1209600000);
            const deletedMessages = await message.channel.bulkDelete(messagesToDelete, true).catch(() => false);
                
            message.channel.send({content : `J'ai supprimé ${deletedMessages.size} message(s)`});
        }
    }
}