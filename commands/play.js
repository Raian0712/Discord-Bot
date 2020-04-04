const Discord = require('discord.js');
const Youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core-discord');
const {youtubeAPI} = require('../config.json');
const youtube = new Youtube(youtubeAPI);

module.exports = {
    name: 'play',
    description: 'Play any song or playlist from youtube',
    async execute(message, args) {
        if(!message.member.voice.channel) {
            message.channel.send('User is not in voice channel! How am I supposed to play?');
        }
        const connection = await message.member.voice.channel.join();
        let url = args.join(' ');
        const dispatcher = connection.play(await ytdl(url), {
            filter: "audioonly",
            type: 'opus',
            highWaterMark: 10000,
        });
        const youTubeEmbed = new Discord.MessageEmbed()
            .setTitle("Video played")
            .setColor("#ff0000")
            .setTimestamp()
            .setDescription(`Now Playing:\n${url}`)

        dispatcher.on('start', () => {
            message.channel.send(youTubeEmbed);
        });

        dispatcher.on('finish', () => {
            message.channel.send("Video has stopped playing.");
        });
    }
}