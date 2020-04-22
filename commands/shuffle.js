const Discord = require('discord.js');
const Youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core-discord');
const {youtubeAPI} = require('../config.json');
const youtube = new Youtube(youtubeAPI);
let {servers} = require('../commands/addqueue.js')

module.exports = {
    name: 'shuffle',
    description: 'Shuffles the list.',
    usage: '',
    category: 'music',
    async execute(message, args) {

        if(!servers[message.guild.id]) {
            servers[message.guild.id] = {
                queue: []
            }
        }

        let server = servers[message.guild.id];
        let data = '';

        if(server.queue.length == 0){
            return message.channel.send("There's no video in queue to shuffle.");
        }

        for (var i = server.queue.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = server.queue[i];
            server.queue[i] = server.queue[j];
            server.queue[j] = temp;
            
        }

        for (const i in server.queue) {
            data += (`${parseInt(i) + 1}. ${server.queue[i].title}\n`);
        }

        const listEmbed = new Discord.MessageEmbed()
                .setTitle('Song Queues')
                .setColor(message.member.displayHexColor)
                .setTimestamp()
                .setDescription(data)

        message.channel.send(listEmbed);
    }
}