module.exports = {
	name: 'leave',
	description: 'Leaves voice channel',
	usage: '',
	category: 'music',
	async execute(message, args) {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.leave();
        }
	}
}