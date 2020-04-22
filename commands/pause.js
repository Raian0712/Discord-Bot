const Discord = require('discord.js');
const Youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core-discord');
const {youtubeAPI} = require('../config.json');
const youtube = new Youtube(youtubeAPI);
//const {dispatcher} = require('../commands/play.js');

module.exports = {
    name: 'pause',
    description: 'Pauses music.',
    usage: '',
    category: 'music',
    async execute(message, args) {
        const connection = await message.member.voice.channel.join();
        let url = args.join(' ');
        if((connection == null || connection == undefined)  || connection.voice.speaking != null || !connection.voice.speaking) {
            message.member.voice.channel.leave();
            return message.channel.send("The bot is not playing any music!");
        }

        connection.dispatcher.pause();

        message.channel.send('Music paused.');
    }
}