module.exports = {
	name: 'ping',
	description: 'Ping!',
	usage: '',
	category: 'general',
	execute(message, args) {
		message.channel.send('Pong.');
	}
}