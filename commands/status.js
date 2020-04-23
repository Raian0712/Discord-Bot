const Discord = require('discord.js');
const client = new Discord.Client();

module.exports = {
	name: 'status',
    description: 'Change the status of the bot (Only available to bot owner)',
    usage: '[status text]',
    category: 'botOwner',
	async execute(message, args) {
        if (message.author.id == '74394882608734208') {
            console.log(args);
            message.client.user.setPresence({
                activity: {
                    name: args.join(' '),
                },
                status: 'online'
            }).then(message.channel.send("Done."))
            .catch((error) => {
                console.log(error.stac);
            })
        } else {
            message.client.users.fetch('74394882608734208').then((owner) => {
                message.channel.send(`Only <@${owner.id}> can change the status of the bot!`);
            });
        }
	}
}