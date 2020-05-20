const Discord = require('discord.js');
const Youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core-discord');
const {youtubeAPI} = require('../config.json');
const youtube = new Youtube(youtubeAPI);
let {servers} = require('../commands/addqueue.js');
const play = require('../commands/play.js');
var highWaterMark = 10485760;
var server;

module.exports = {
    name: 'repeat',
    description: 'Repeats the first song in the queue',
    usage: '',
    category: 'music',
    async execute(message, args) {
        const connection = await message.member.voice.channel.join();
        if(!servers[message.guild.id]) {
            servers[message.guild.id] = {
                queue: []
            }
        }

        if(!message.member.voice.channel) {
            message.channel.send('User is not in voice channel!');
        }

        if (servers[message.guild.id].queue[0]) {
            //connection.dispatcher.destroy();
            servers[message.guild.id].queue.splice(0, 0, servers[message.guild.id].queue[0]);
            //play.execute(message, args);
        }

        //message.channel.send("This do nothing for now.");
    }
}