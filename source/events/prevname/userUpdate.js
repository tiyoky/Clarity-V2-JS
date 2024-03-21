module.exports = {
    name: "userUpdate",
    run: async(client, oldUser, newUser) => {
        if (oldUser.username !== newUser.username) {
            if (oldUser.bot) return;  // if the user is a bot
           let prev = await client.prevname.get(`prevname_${oldUser.id}`) || []

           prev.push({
                oldUsername: oldUser.username,
                newUsername: newUser.username,
                date: parseInt(new Date() / 1000)
           })

           await client.prevname.set(`prevname_${oldUser.id}`, prev)

           console.log(
            `${oldUser.username} => ${newUser.username} (${oldUser.id})`
           )
            
        }
    }
}