module.exports = {
	name: 'avatar',
	description: 'Displays avatar',
	usage: '',
	category: 'general',
	execute(message, args) {
		message.channel.send(message.author.displayAvatarURL({'format':'png', 'size':2048}));
	}
}