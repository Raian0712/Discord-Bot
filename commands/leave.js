const {channels} = require('../commands/gradio.js');

module.exports = {
	name: 'leave',
	description: 'Leaves voice channel',
	usage: '',
	category: 'music',
	async execute(message, args) {
        if (message.member.voice.channel) {
			const connection = await message.member.voice.channel.leave();

			if (channels[message.channel.id].interval) {
				console.log('Stopping Gensokyo Radio..');
				clearInterval(channels[message.channel.id].interval);
			}
        }
	}
}