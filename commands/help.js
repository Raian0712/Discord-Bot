const Discord = require('discord.js');
const {prefix} = require('../config.json');
const fs = require('fs');

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    usage: '[command name]',
    category: 'general',
    async execute(message, args) {
        const data = [];
        const {commands} = message.client;
        const generalCommands = [];
        const musicCommands = [];
        const imageCommands = [];
        const botOwnerCommands = [];

        let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

        if(!prefixes[message.guild.id]) {
            prefixes[message.guild.id] = {
                prefixes: prefix
            }
        }

        var botPrefix = prefixes[message.guild.id].prefixes;

        await commands.map(command => {
            if (command.category == 'general') {
                generalCommands.push(command.name);
            } else if (command.category == 'music') {
                musicCommands.push(command.name);
            } else if (command.category == 'image') {
                imageCommands.push(command.name);
            } else if (command.category == 'botOwner') {
                botOwnerCommands.push(command.name);
            }
        })

        const helpMessage = new Discord.MessageEmbed()
            .setTitle('Help Menu')
            .setColor(message.member.displayHexColor)
            .setTimestamp()
            .setDescription(`Here\'s a list of all my commands.\nYou can send \`${botPrefix}help [command name]\` to get info on a specific command!`)
            .addFields({
                name: 'General',
                value: `\`\`\`${generalCommands.join(', ')}\`\`\``
            }, {
                name: 'Musics',
                value: `\`\`\`${musicCommands.join(', ')}\`\`\``
            }, {
                name: 'Image Search',
                value: `\`\`\`${imageCommands.join(', ')}\`\`\``
            }, {
                name: 'Bot Owner Commands',
                value: `\`\`\`${botOwnerCommands.join(', ')}\`\`\``
            });

        if (!args.length) {
            return message.channel.send(helpMessage);
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('that\'s not a valid command!');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${botPrefix}${command.name} ${command.usage}`);

        //data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        const detailHelpMessage = new Discord.MessageEmbed()
            .setTitle('Help Menu')
            .setColor(message.member.displayHexColor)
            .setTimestamp()
            .setDescription(data);

        message.channel.send(detailHelpMessage);
    },
};