module.exports = {
	name: 'leave',
	description: 'Leaves voice channel',
	async execute(message, args) {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.leave();
        }
	}
}