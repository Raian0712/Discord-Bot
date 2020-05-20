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
            let time = connection.dispatcher.streamTime / 1000;
            let timeSecond;
            let timeMinute;

            if (time >= 60) {
                timeMinute = Math.floor(time / 60);
            } else {
                timeMinute = 0;
            }

            if (Math.floor(time % 60) < 10) {
                timeSecond = "0" + Math.floor(time % 60);
            } else {
                timeSecond = Math.floor(time % 60);
            }

            const youTubeEmbed = new Discord.MessageEmbed()
                .setAuthor("Now playing")
                .setTitle(`${server.queue[0].title}`)
                .setURL(`${server.queue[0].url}`)
                .setColor("#ff0000")
                .setTimestamp()
                .setThumbnail(servers[message.guild.id].queue[0].thumbnail)
                //.setDescription(`${server.queue[0].title}\n${server.queue[0].url}`)
                .addField('Views', servers[message.guild.id].queue[0].views, true)
                .addField('Duration', `${timeMinute}:${timeSecond}/${servers[message.guild.id].queue[0].duration}`, true)
                .addField('_ _', '_ _', false)
                .addField('Uploaded At', servers[message.guild.id].queue[0].uploaded_at, true)
                .addField('Channel', servers[message.guild.id].queue[0].channel, true);

            message.channel.send(youTubeEmbed);
        }

        
    }
}