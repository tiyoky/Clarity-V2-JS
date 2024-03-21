module.exports = {
    name: "massiverole",
  category: "⚙️〢Owner",
    run: async (client, message, args) => {
        const isOwn = await client.db.oneOrNone(
            `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
            [message.author.id]
          );
          if (!isOwn) {
            return message.reply({
              content: "Vous n'avez pas la permission d'utiliser cette commande",
            });
          }
         
          let role =
          message.guild.roles.cache.get(args[1]) ||
          message.mentions.roles.first() ||
          message.guild.roles.cache.find((r) => r.name === args[1]) ||
          message.guild.roles.cache.find(
            (r) => r.name.toLowerCase() === args[0].toLowerCase()
          );
        if (!role) return message.reply(``);
    
        let users = message.guild.members.cache.filter(
          (m) => !m.roles.cache.has(role.id)
        );
    
        if ( args[0] === "add" ){
          // add the role to all users

          users.forEach(async (user) => {
            try {
              await user.roles.add(role);
            } catch (error) {
              console.error(`Error adding role to user ${user.user.tag}:`, error);
            }
          });
          // reply a message
          message.reply(`Added role ${role.name} to ${users.size} users`);
        }

        if ( args[0] === "remove" ){
          // remove the role from all users
          users.forEach(async (user) => {
            try {
              await user.roles.remove(role);
            } catch (error) {
              console.error(`Error removing role from user ${user.user.tag}:`, error);
            }
          });
          // reply a message
          message.reply(`Removed role ${role.name} from ${users.size} users`);
        }
          // let msg = await message.channel.send({content: 'chargement du module en cours . . .'})
          // await update(client, message, msg)
    }
}
// async function update(client, message, msg) {
//     const db = client.data.get(`massiverolera_${message.guild.id}`)
//     if (!db) return;
//     let memb = message.guild.members.cache.filter(m => m.roles.cache.has(db)).length
//     let color = parseInt(client.color.replace('#', ''), 16);
//     msg.edit({
//         content: null,
//         embeds: [
//             {
//                 title: `${message.guild.name} massive Role`,
//                 description: `Il y a ${memb} membres avec un role`,
//                 color: color
//             }
//         ]
//     })

// }