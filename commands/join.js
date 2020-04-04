module.exports = {
	name: 'join',
	description: 'Joins voice channel',
	async execute(message, args) {
		if(message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
        }
	}
}