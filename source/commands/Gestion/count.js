module.exports = {
    name: "count",
    description: 'Permet de definir un salon pour compter',
    run: async(client, message, args) => {
        if (client.config.devs?.includes(message.author.id)) {
            let ss = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
            if (args[0] === "on") {
                const channel = message.channel;
                let db = await client.data.get(`count_${message.guild.id}`) || {
                    channels: [],
                    number: 0
                }
                db.channels.push(channel.id)
                await client.data.set(`count_${message.guild.id}`,db)
                channel.send(`Le salon : ${channel} viens d'être défini comme salon pour compter`)
            }
            else if (args[0] === "off") {
                const channel = message.channel;
                let db = await client.data.get(`count_${message.guild.id}`) || {
                    channels: [],
                    number: 0
                }
                db.channels.splice(db.channels.indexOf(channel.id), 1)
                await client.data.set(`count_${message.guild.id}`,db)
                channel.send(`Le salon : ${channel} viens d'être défini comme salon pour compter`)
            } else if (args[0] === "reset") {
                let db = await client.data.get(`count_${message.guild.id}`) || {
                    channels: [],
                    number: 0
                };
                db.channels = [];
                db.number = 0;
                await client.data.set(`count_${message.guild.id}`, db);
                message.channel.send("Le compteur a été réinitialisé avec succès.")
            } else {
                if(ss) {
                    let db = await client.data.get(`count_${message.guild.id}`) || {
                        channels: [],
                        number: 0
                    }
                    if(db.channels.includes(ss.id)) {
                        db.channels.splice(db.channels.indexOf(ss.id), 1)
                        await client.data.set(`count_${message.guild.id}`,db)
                        message.channel.send(`Le salon : ${ss} viens d'être retirer des salon pour compter`)
                    } else {
                        db.channels.push(ss.id)
                        await client.data.set(`count_${message.guild.id}`,db)
                        message.channel.send(`Le salon : ${ss} viens d'être défini comme salon pour compter`)
                    }
                }
            }
        } else {
            const isOwn = await client.db.oneOrNone(
                `SELECT 1 FROM clarity_${client.user.id}_${message.guild.id}_owners WHERE user_id = $1`,
                [message.author.id]
            );
            if (!isOwn) {
                return message.reply({
                    content: "Vous n'avez pas la permission d'utiliser cette commande",
                });
            }
            let ss = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
            if (args[0] === "on") {
                const channel = message.channel;
                let db = await client.data.get(`count_${message.guild.id}`) || {
                    channels: [],
                    number: 0
                }
                db.channels.push(channel.id)
                await client.data.set(`count_${message.guild.id}`,db)
                channel.send(`Le salon : ${channel} viens d'être défini comme salon pour compter`)
            }
            else if (args[0] === "off") {
                const channel = message.channel;
                let db = await client.data.get(`count_${message.guild.id}`) || {
                    channels: [],
                    number: 0
                }
                db.channels.splice(db.channels.indexOf(channel.id), 1)
                await client.data.set(`count_${message.guild.id}`,db)
                channel.send(`Le salon : ${channel} viens d'être défini comme salon pour compter`)
            } else if (args[0] === "reset") {
                let db = await client.data.get(`count_${message.guild.id}`) || {
                    channels: [],
                    number: 0
                };
                db.channels = [];
                db.number = 0;
                await client.data.set(`count_${message.guild.id}`, db);
                message.channel.send("Le compteur a été réinitialisé avec succès.")
            } else {
                if(ss) {
                    let db = await client.data.get(`count_${message.guild.id}`) || {
                        channels: [],
                        number: 0
                    }
                    if(db.channels.includes(ss.id)) {
                        db.channels.splice(db.channels.indexOf(ss.id), 1)
                        await client.data.set(`count_${message.guild.id}`,db)
                        message.channel.send(`Le salon : ${ss} viens d'être retirer des salon pour compter`)
                    } else {
                        db.channels.push(ss.id)
                        await client.data.set(`count_${message.guild.id}`,db)
                        message.channel.send(`Le salon : ${ss} viens d'être défini comme salon pour compter`)
                    }
                }
            }
        }
    }
}