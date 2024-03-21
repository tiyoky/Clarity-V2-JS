module.exports = {
    name: "randomuser",
    aliases: ["randomuser"],
    category: "Info",
    utilisation: '{prefix}randomuser',
    run: async(client, message, args) => {
        const members = await message.guild.members.fetch();
        const randomMember = members.random();

        message.reply({ content: `${randomMember}` });
    }
}