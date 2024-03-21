
const os = require('os');
const { EmbedBuilder } = require("discord.js");
module.exports = {
    name: "vps",
    description: "Get info of your VPS",
    run: async (client, message) => {
        let color = parseInt(client.color.replace("#", ""), 16);
        let embed = new EmbedBuilder()
            .setColor(color)
            .setFooter({ text: `${client.config.footer.text}` })
            .setTimestamp()
            .setAuthor({ name: "VPS Info" })
            .addFields(
                {
                    name: "CPU",
                    value: `${os.cpus()[0].model}`,
                    inline: true
                },
                {
                    name: "RAM",
                    value: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
                    inline: true
                },
                {
                    name: "Free RAM",
                    value: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
                    inline: true
                },
                {
                    name: 'Uptime',
                    value: `${(os.uptime() / 3600).toFixed(2)} hours`,
                    inline: true
                },
                {
                    name: "Platform",
                    value: `${os.platform()}`,
                    inline: true
                },
                {
                    name: "Architecture",
                    value: `${os.arch()}`,
                    inline: true
                },
                {
                    name: "OS",
                    value: `${os.release()}`,
                    inline: true
                }
            )
        message.reply({ embeds: [embed] });


    }
}