const Discord = require('discord.js');
module.exports = {
    name: "banlist",
   category: "💻〢Informations",
    description : "Affiche la liste des utilisateurs bannis",
    aliases : ["banl"],
    run: async(client, message) => {
        if(!message.member.permissions.has("Ban_Members")) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.");

        let guild = message.guild;
        const color = parseInt(client.color.replace('#', ''), 16);
        let bans = await guild.bans.fetch();
        const list = (await bans).map((member) => member.user.tag + " (" + member.user.id + ")").join("\n")
        if(bans.size === 0) return message.channel.send("Aucun utilisateur bannis.");
              // affiche la banlist dans un fichier txt

        const out = new Discord.AttachmentBuilder(Buffer.from(list), {name: 'banlist.txt'});
        message.channel.send({files: [out]})

    }
}