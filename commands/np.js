const Discord = require('discord.js');
let {servers} = require('../commands/addqueue.js');
var server;

module.exports = {
    name: 'np',
    description: 'Shows the song that is playing now',
    usage: '',
    category: 'music',
    async execute(message, args) {
        const connection = await message.member.voice.channel.join();
        if(!servers[message.guild.id]) {
            servers[message.guild.id] = {
                queue: []
            }
        }

        server = servers[message.guild.id];

        if(!message.member.voice.channel) {
            message.channel.send('User is not in voice channel! I don\'t know what to play either!');
        }

        if(server.queue.length >= 1) {
            const youTubeEmbed = new Discord.MessageEmbed()
                .setTitle("Now playing")
                .setColor("#ff0000")
                .setTimestamp()
                .setDescription(`${server.queue[0].title}\n${server.queue[0].url}`);

            message.channel.send(youTubeEmbed);
        }

        
    }
}