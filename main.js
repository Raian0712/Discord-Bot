/* eslint-disable indent */
/* eslint-disable linebreak-style */
/* eslint-disable no-tabs */
/* eslint-disable max-len */
// eslint-disable-next-line linebreak-style
// Discord API
'use strict';

const fs = require('fs');
const Discord = require('discord.js');
const {prefix, token} = require('./config.json');

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
});

client.login(process.env.TOKEN);
