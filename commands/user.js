module.exports = {
	name: 'user',
	description: 'Display user info.',
	execute(message, args) {
		message.channel.send(`\`\`\`Your user name: ${message.author.username}\nYour ID: ${message.author.id}\`\`\``);
	}
}