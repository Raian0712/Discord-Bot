module.exports = {
	name: 'close',
	description: 'Close the bot (WIP never use at all)',
	execute(message, args) {
		message.channel.send(`\`\`\`Closing..\`\`\``);
		process.exit();
	}
}