module.exports = {
	name: 'reload',
    description: 'Reload a command. Only bot owner can use this.',
    args: true,
    usage: '[command]',
    category: 'botOwner',
	execute(message, args) {
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName);

        if (message.author.id != '74394882608734208') {
            message.client.users.fetch('74394882608734208').then((owner) => {
                return message.channel.send(`Only <@${owner.id}> can reload commands!`);
            });
        } else {
            if (!command) {
                return message.channel.send("No commands found.");
            }
    
            delete require.cache[require.resolve(`./${command.name}.js`)];
    
            try {
                const newCommand = require(`./${command.name}.js`);
                message.client.commands.set(newCommand.name, newCommand);
            } catch (error) {
                console.log(error);
                return message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``)
            }
            message.channel.send(`Command \`${command.name}\` was reloaded.`);
        }

        
	}
}