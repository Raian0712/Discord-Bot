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
    //guild = message.guild;
    const args = message.content.split(' ').slice(1);
    const command = message.content.slice(prefix.length).split(/ +/).shift().toLowerCase();

    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

    if(!prefixes[message.guild.id]) {
        prefixes[message.guild.id] = {
            prefixes: prefix
        }
    }

    var botPrefix = prefixes[message.guild.id].prefixes;

    const prefixEmbed = new Discord.MessageEmbed()
        .setTitle("Prefix")
        .setColor(message.member.displayHexColor)
        .setDescription(`Current prefix is ${botPrefix}.`)
        .setTimestamp();
    

    if(message.content == 'prefix') {
        message.channel.send(prefixEmbed);
    }

    if (!message.content.startsWith(botPrefix) || message.author.bot) return;
    
    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${error.stack}\n\`\`\``);
    }

	
});

process.on("unhandledRejection", (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
})

client.login(process.env.TOKEN);
