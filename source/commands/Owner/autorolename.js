module.exports = {
  name: "autorolename",
  category: "Owner",
  description:
    "Permet de changer le nom de l utilisateur en fonction du role automatiquement",
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

    if (!args[0]) {
      return message.reply({
        content: "Veuillez preciser <add/remove/list>",
      });
    }

    if (args[0] === "add") {
      let role =
        message.mentions.roles.first() ||
        message.guild.roles.cache.get(args[1]);
      if (!role) {
        return message.reply({
          content: "Veuillez preciser le role",
        });
      }

      let name = args.slice(1).join(" ");
      if (!name) {
        return message.reply({
          content: "Veuillez preciser le nouveau nom",
        });
      }

      let autoname = (await client.settings.get(
        `autoname_${message.guild.id}`
      )) || {
        // pour plusieurs roles
        roles: [],
      };

      autoname.roles.push({
        role: role.id,
        name: name,
      });
    }

    if (args[0] === "remove") {
      let role =
        message.mentions.roles.first() ||
        message.guild.roles.cache.get(args[1]);
      if (!role) {
        return message.reply({
          content: "Veuillez preciser le role",
        });
      }
      let autoname = (await client.settings.get(
        `autoname_${message.guild.id}`
      )) || {
        // pour plusieurs roles
        roles: [],
      };
      // supprime le role et le nom
      autoname.roles = autoname.roles.filter((r) => r.role !== role.id);

      await client.settings.set(`autoname_${message.guild.id}`, autoname);

      return message.reply({
        content: `Le role ${role.name} a bien été supprimé de la liste des roles avec un nom automatique`,
      });
    }

    if (args[0] === "list") {
      let autoname = (await client.settings.get(
        `autoname_${message.guild.id}`
      )) || {
        // pour plusieurs roles
        roles: [],
      };
      return message.reply({
        content: `Liste des roles avec un nom automatique : \n ${autoname.roles
          .map((r) => r.name)
          .join("\n")}`,
      });
    }
  },
};
