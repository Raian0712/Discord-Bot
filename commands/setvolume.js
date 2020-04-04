const Discord = require('discord.js');
const Youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core-discord');
const {youtubeAPI} = require('../config.json');
const youtube = new Youtube(youtubeAPI);
//const {dispatcher} = require('../commands/play.js');

module.exports = {
    name: 'setvolume',
    description: 'Sets volume of the bot',
    async execute(message, args) {
        const connection = await message.member.voice.channel.join();
        let url = args.join(' ');
        if((connection == null || connection == undefined) || connection.voice.speaking != null || !connection.voice.speaking) {
            message.member.voice.channel.leave();
            return message.channel.send("The bot is not playing any music!");
        }
        if(args < 0.00 || args > 1.00) {
            return message.channel.send("Invalid volume! Please enter a range from 0.00 to 1.00 only.");
        }

        let volume = args * 100;
        const youTubeEmbed = new Discord.MessageEmbed()
            .setTitle("Volume set to:")
            .setDescription(`${volume}%`)
            .setColor("#ff0000")
            .setTimestamp()

        connection.dispatcher.setVolume(args);

        message.channel.send(youTubeEmbed);
    }
}