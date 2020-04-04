/* eslint-disable indent */
/* eslint-disable linebreak-style */
/* eslint-disable no-tabs */
/* eslint-disable max-len */
// eslint-disable-next-line linebreak-style
// Discord API
'use strict';

const Discord = require('discord.js');
const {prefix, ownerID} = require('./config.json');
const client = new Discord.Client();
// const consoleEmbed = new Discord.MessageEmbed().setTitle('Console');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (message)=> {
	const args = message.content.split(' ').slice(1);

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	if (message.content.startsWith(prefix + 'ping')) {
		message.channel.send('\`\`\`pong\`\`\`');
	} else if (message.content.startsWith(prefix + 'user')) {
		message.channel.send(`\`\`\`Your user name: ${message.author.username}\nYour ID: ${message.author.id}\`\`\``);
	} else if (message.content.startsWith(prefix + 'close')) {
		message.channel.send(`\`\`\`Closing..\`\`\``);
		process.exit();
	} else if (message.content.startsWith(prefix + 'code')) {
		if (message.author.id !== ownerID) return;
		try {
			const code = args.join(' ');
			let evaled = eval(code);

			// Run time
			const hrStart = process.hrtime();
			const hrDiff = process.hrtime(hrStart);

			if (typeof evaled !== 'string') {
				evaled = require('util').inspect(evaled);
			}
            message.channel.send(`*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}ms.*`)
			message.channel.send(clean(evaled), {code: 'xl'});
		} catch (error) {
			message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(error)}\n\`\`\``);
		}
	}
});

/**
 * cleans text to code
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

client.login(process.env.TOKEN);
