const Discord = require('discord.js');
const {ownerID} = require('../config.json');
const {inspect} = require('util');

module.exports = {
	name: 'code',
	description: 'Coding sandbox.',
	async execute(message, args) {
		if (message.author.id !== ownerID) return;
		try {
            const code = args.join(' ').replace(/^[ \n]+```(?:js|javascript)?\n([^]+)```$/, (found, code, index, input) => code);
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

/**
 * idk
 * @param {string} text
 * @return {string} output code
 */
function clean(text) {
	if (typeof(text) === 'string') {
		return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
	} else {
		return text;
	}
}