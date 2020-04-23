const Discord = require('discord.js');
const {prefix} = require('../config.json');
const fs = require('fs');

module.exports = {
    name: 'prefix',
    description: 'Changes prefix of the bot.',
    usage: '[new prefix]',
    category: 'botOwner',
    async execute(message, args) {
        if(!message.member.hasPermission("MANAGE_GUILD")) {
            return message.reply("not enough permision. Need at least manage server permissions.");
        }

        const prefixes = JSON.parse(fs.readFileSync("./prefixes.json", 'utf8'));

        if (args[0] != undefined) {
            prefixes[message.guild.id] = {
                prefixes: args[0]
            }
            fs.writeFile("./prefixes.json", JSON.stringify(prefixes), (err) => {
                if(err) {
                    console.log(err.stack);
                }
            })
    
            const prefixEmbed = new Discord.MessageEmbed()
                .setTitle("Prefix Changed")
                .setColor(message.member.displayHexColor)
                .setDescription(`Prefix set to ${args[0]}.`)
                .setTimestamp();
    
            message.channel.send(prefixEmbed);
        } else {
            message.channel.send("Invalid new prefix.");
        }

        

        
    }
};