const Discord = require('discord.js');
const Youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core-discord');
const {
    youtubeAPI
} = require('../config.json');
const youtube = new Youtube(youtubeAPI);
let {
    servers
} = require('../commands/addqueue.js')

module.exports = {
    name: 'stop',
    description: 'Stops all songs in the queue and resets queue.',
    usage: '',
    category: 'music',
    async execute(message, args) {
        if (message.member.voice.channel !== null) {
            const connection = await message.member.voice.channel.join();
            if (!servers[message.guild.id]) {
                servers[message.guild.id] = {
                    queue: []
                }
            }

            let server = servers[message.guild.id];

            if (!message.member.voice.channel) {
                message.channel.send('User is not in voice channel! How am I supposed to stop?');
            }

            if (connection.dispatcher) {
                connection.dispatcher.end();
            }

            server.queue = [];
            message.channel.send("Stopping all queues.");
        } else {
            message.channel.send('User is not in voice channel!');
        }

    }
}