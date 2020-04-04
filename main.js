/* eslint-disable indent */
/* eslint-disable linebreak-style */
/* eslint-disable no-tabs */
/* eslint-disable max-len */
// eslint-disable-next-line linebreak-style
// Discord API
'use strict';

const fs = require('fs');
const Discord = require('discord.js');
const {prefix, ownerID} = require('./config.json');
const {inspect} = require('util');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // Set a new item in the collection
    // with the key as the command name and the value as the exported module
    client.commands.set(command.name, command);
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (message)=> {
    const args = message.content.split(' ').slice(1);
    const command = message.content.slice(prefix.length).split(/ +/).shift().toLowerCase();

    if (!message.content.startsWith(prefix) || message.author.bot) return;
    
    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(error)}\n\`\`\``);
    }

	/*if (message.content.startsWith(prefix + 'ping')) {
		client.commands.get('ping').execute(message, args);
	} else if (message.content.startsWith(prefix + 'user')) {
		message.channel.send(`\`\`\`Your user name: ${message.author.username}\nYour ID: ${message.author.id}\`\`\``);
	} else if (message.content.startsWith(prefix + 'close')) {
		message.channel.send(`\`\`\`Closing..\`\`\``);
		process.exit();
	} else if (message.content.startsWith(prefix + 'code')) {
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
	}*/
});

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

client.login(process.env.TOKEN);
