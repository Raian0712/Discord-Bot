const Discord = require('discord.js');
const Youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core-discord');
const {youtubeAPI} = require('../config.json');
const youtube = new Youtube(youtubeAPI);
let {servers} = require('../commands/addqueue.js');
let addqueue = require('../commands/addqueue.js');
let server;
var highWaterMark = 10485760;
//let playing = false;

module.exports = {
    name: 'play',
    description: 'Play any song from youtube or from queue',
    usage: '',
    category: 'music',
    async execute(message, args) {
        if(!message.member.voice.channel) {
            return message.channel.send('User is not in voice channel! How am I supposed to play?');
        }
        const connection = await message.member.voice.channel.join();

        if(!servers[message.guild.id]) {
            console.log("Building empty server queues..")
            servers[message.guild.id] = {
                queue: []
            }
        }

        if (args.join(' ')) {
            message.channel.send("Please use addqueue to search for videos for now, testing purposes");
        }
    
        server = servers[message.guild.id];

        //await addqueue.execute(message, args);
        
        //if (!playing) {
        play(message, connection);
        //}
    }
}

async function play(message, connection) {
    //playing = true;
    const youTubeEmbed = new Discord.MessageEmbed()
                .setTitle("Video played")
                .setColor("#ff0000")
                .setTimestamp();

    const statusEmbed = new Discord.MessageEmbed();

    let embedMessage;

    if (servers[message.guild.id].queue.length >= 1) {
        //console.log(queue);
        console.log(servers[message.guild.id].queue[0].url);
        let dispatcher;
        
        if(servers[message.guild.id].queue[0].url) {
            dispatcher = connection.play(await ytdl(servers[message.guild.id].queue[0].url), {
                filter: "audioonly",
                type: 'opus',
                highWaterMark: highWaterMark,
            });
    
            youTubeEmbed.setDescription(`**Now Playing:**\n\n**${servers[message.guild.id].queue[0].title}**\n${servers[message.guild.id].queue[0].url}`);
            youTubeEmbed.setThumbnail(servers[message.guild.id].queue[0].thumbnail);
            youTubeEmbed.addField('Views', servers[message.guild.id].queue[0].views, true);
            youTubeEmbed.addField('Duration', servers[message.guild.id].queue[0].duration, true);
            youTubeEmbed.addField('_ _', '_ _', false);
            youTubeEmbed.addField('Uploaded At', servers[message.guild.id].queue[0].uploaded_at, true);
            youTubeEmbed.addField('Channel', servers[message.guild.id].queue[0].channel, true);

            statusEmbed.setDescription("Playing video in queue..");
    
            message.channel.send(statusEmbed);
        } else {
            return message.channel.send("Something went wrong.");
        }

        dispatcher.on('start', () => {
            message.channel.send(youTubeEmbed);
        });
        
        dispatcher.on('finish', async () => {
            if(servers[message.guild.id].queue.length >= 1) {
                statusEmbed.setDescription("Video Finished playing. Loading next video to play..");
                embedMessage = await message.channel.send(statusEmbed);
            }
            
            servers[message.guild.id].queue.shift();
            if(servers[message.guild.id].queue.length < 1){
                statusEmbed.setDescription('Queue has stopped playing.');
                embedMessage.edit(statusEmbed);
                //playing = false;
            } else {
                play(message, connection);
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