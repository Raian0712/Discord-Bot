module.exports = {
	name: 'code',
	description: 'Coding sandbox.',
	execute(message, args) {
		if (message.author.id !== ownerID) return;
		try {
            const code = args.join(' ');
            const console = {
                embed: true,
                image: '',
                message: '',
                code_block: true,
                colour: 11395071,
                title: 'Output:',
                buffer: '',
                log: (input) => console.buffer += (inspect(input) + '\n'),
            };
            let evaled;
            let returned = await eval(`(async () => {${code}})()`);
            const consoleEmbed = new Discord.MessageEmbed()
                .setTitle(console.title)
                .setColor(console.colour)
                .setTimestamp()
                .setDescription('```js\n' + `${(console.buffer)}` + '```')
                .addFields(
                    {name: 'Returned', value: returned},
                );

			if (typeof returned !== 'string') {
				returned = inspect(returned);
			}
            // message.channel.send(clean(returned), {code: 'xl'});
            message.channel.send(consoleEmbed);
            // console.log('Output: ' + (clean(returned)));
            console.buffer = '';
		} catch (error) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(error)}\n\`\`\``);
            console.buffer = '';
		}
	}
}