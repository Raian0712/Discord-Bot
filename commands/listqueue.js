const Discord = require('discord.js');
const Youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core-discord');
const {youtubeAPI} = require('../config.json');
const youtube = new Youtube(youtubeAPI);
//const servers = {};
const {servers} = require('../commands/addqueue.js')

let dispatcher;

module.exports = {
    name: 'listqueue',
    description: 'List videos in queue',
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

        //console.log(server.queue);

        if(server.queue.length == 0){
            return message.channel.send("There's no video in queue.");
        }

        for(const i in server.queue) {
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