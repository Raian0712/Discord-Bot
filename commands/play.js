const Discord = require('discord.js');
const Youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core-discord');
const {youtubeAPI} = require('../config.json');
const youtube = new Youtube(youtubeAPI);
let {servers} = require('../commands/addqueue.js');
let server;
var highWaterMark = 10485760;

module.exports = {
    name: 'play',
    description: 'Play any song from youtube or from queue',
    usage: '',
    category: 'music',
    async execute(message, args) {
        if(!message.member.voice.channel) {
            message.channel.send('User is not in voice channel! How am I supposed to play?');
        }
        const connection = await message.member.voice.channel.join();

        if(!servers[message.guild.id]) {
            console.log("Building empty server queues..")
            servers[message.guild.id] = {
                queue: []
            }
        }
    
        server = servers[message.guild.id];
        
        play(message, connection, server.queue);
    }
}

async function play(message, connection, queue) {
    const youTubeEmbed = new Discord.MessageEmbed()
                .setTitle("Video played")
                .setColor("#ff0000")
                .setTimestamp();
    if (queue.length >= 1) {
        //console.log(queue);
        const dispatcher = connection.play(await ytdl(queue[0].url), {
            filter: "audioonly",
            type: 'opus',
            highWaterMark: highWaterMark,
        });

        youTubeEmbed.setDescription(`**Now Playing:**\n\n**${queue[0].title}**\n${queue[0].url}`);
        youTubeEmbed.setThumbnail(queue[0].thumbnail);

        message.channel.send("Grabbing video from queue to play..");

        dispatcher.on('start', () => {
            message.channel.send(youTubeEmbed);
        });
        
        dispatcher.on('finish', async () => {
            if(server.queue.length >= 1) {
                message.channel.send("Video Finished playing. Loading next video to play..");
            }
            
            server.queue.shift();
            if(server.queue.length < 1){
                message.channel.send("Queue has stopped playing.");
            } else {
                play(message, connection, server.queue);
            }
        });

        dispatcher.on('error', (error) => {
            console.log(error);
            message.channel.send("Error Occured during playback.");
        });

        dispatcher.on('volumeChange', (oldVol, newVol) => {
            var oldVolume = oldVol * 100;
            var newVolume = newVol * 100;
            const youTubeEmbed = new Discord.MessageEmbed()
            .setTitle("Volume set to:")
            .setDescription(`${newVolume}%, was ${oldVolume}%\n\nMay take a while to notice changes..`)
            .setColor("#ff0000")
            .setTimestamp()

            message.channel.send(youTubeEmbed);
        })
    } else {
        message.channel.send("No more songs in queue.");
        return;
    }
    
}