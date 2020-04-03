//Discord API
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message=> {
    console.log(message.content);
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    if (message.content === `${prefix}ping`) {
        message.channel.send('pong');
    }
    else if(message.content === `${prefix}user`) {
        message.channel.send(`Your user name: ${message.author.username}\nYour ID: ${message.author.id}`);
    }
    else if(message.content === `${prefix}close`) {
        process.exit();
    }
});

client.login(token);