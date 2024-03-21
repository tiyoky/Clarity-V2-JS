module.exports = {
    name: "voiceStateUpdate",
    run: async (client, oldState, newState) => {
        // Check if the user joined a voice channel or switched from one channel to another
        if ((!oldState.channelId && newState.channelId) || (oldState.channelId !== newState.channelId)) {
            // Fetch the user who joined the voice channel
            const user = newState.member;

            // Fetch the blacklist from the cache
            const db = client.data2.get(`blvoc_${newState.guild.id}`) || {
                users: []
            };

            // If the user is blacklisted, disconnect them from the voice channel
            if (db.users.includes(user.id)) {
                newState.setChannel(null);
            }
        }
    }
};
