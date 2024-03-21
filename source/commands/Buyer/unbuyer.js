const Discord = require("discord.js");
const { Clarity } = require("../../structures/client/index");

module.exports = {
  name: "unbuyer",
  category: "🛠️〢Buyer",
  /**
   * @param {Clarity} client
   */
  run: async (client, message, args) => {
    const isBuy = await client.functions.isBuy(client, message.author.id);
    if (!isBuy) {
      return message.reply({
        content: "Vous n'avez pas la permission d'utiliser cette commande",
      });
    }
    await client.db.none(`
      CREATE TABLE IF NOT EXISTS clarity_${client.user.id}_buyers (
        user_id VARCHAR(20) PRIMARY KEY
      )`);
    let color = parseInt(client.color.replace('#', ''), 16);
    const user = message.mentions.members.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => { })

    if (!user) {
      return message.reply({ content: "Veuillez mentionner un utilisateur à retirer des buyers." });
    }
    const isBlacked = await client.db.oneOrNone(
      `SELECT 1 FROM clarity_${client.user.id}_buyers WHERE user_id = $1`,
      [user.id]
    );

    if (!isBlacked) {
      return message.reply({ content: `${user} n'est pas owner bot.` });
    }

    await client.db
      .none(
        `
        DELETE FROM clarity_${client.user.id}_buyers WHERE user_id = $1
        `,
        [user.id]
      )
      .then(message.reply({ content: `${user} a été retiré des buyers.` }))
      .catch((error) => {
        console.log("Erreur lors de la mise à jour de la DB : " + error);
        message.reply({
          content: "Une erreur s'est produite lors de la suppression de l'utilisateur des buyers.",
        });
      });
  },
};
