module.exports = {
	name: 'avatar',
	description: 'Displays avatar',
	execute(message, args) {
		message.channel.send(message.author.displayAvatarURL({'format':'png', 'size':2048}));
	}
}