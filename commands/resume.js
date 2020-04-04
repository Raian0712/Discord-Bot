const Discord = require('discord.js');
const Youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core-discord');
const {youtubeAPI} = require('../config.json');
const youtube = new Youtube(youtubeAPI);
//const {dispatcher} = require('../commands/play.js');

module.exports = {
    name: 'resume',
    description: 'Resumes music.',
    async execute(message, args) {
        var pauseValid = false;
        const connection = await message.member.voice.channel.join();
        let url = args.join(' ');
        
        /*connection.dispatcher.on('start', () => {
            pauseValid = true;
        });

        connection.dispatcher.on('finish', () => {
            pauseValid = false;
        });*/

        if((connection == null || connection == undefined) || (connection.dispatcher == null || connection.dispatcher == undefined)) {
            message.member.voice.channel.leave();
            return message.channel.send("The bot is not playing any music!");
        }

        connection.dispatcher.resume();

        message.channel.send('Music resumed.');
    }
}