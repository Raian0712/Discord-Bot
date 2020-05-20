const Discord = require('discord.js');
const client = new Discord.Client();
const ytdl = require('ytdl-core-discord');
const {youtubeAPI} = require('../config.json');
const grnp = require('../commands/grnp.js');
const channels = {};
//var highWaterMark = 10485760;
//var interval;

module.exports = {
    name: 'gradio',
    description: 'Plays Gensokyo Radio',
    usage: '',
    category: 'music',
    channels: channels,
    async execute(message, args) {
        if(!message.member.voice.channel) {
            return message.channel.send('User is not in voice channel! How am I supposed to play?');
        }

        if(!channels[message.channel.id]) {
            channels[message.channel.id] = {
                interval: undefined
            };
        }

        const connection = await message.member.voice.channel.join();
        const broadcast = client.voice.createBroadcast();
        broadcast.play(`http://stream.gensokyoradio.net:8000/stream/1/`);
        const dispatcher = connection.play(broadcast);
        //console.log(dispatcher.broadcast);

        dispatcher.on('start', async () => {
            await message.channel.send("Playing Gensokyo Radio..");
        });

        dispatcher.on('finish', async () => {
            await message.channel.send("Stopping Gensokyo Radio..");
        })

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

        channels[message.channel.id].interval = setTimeout(() => {
            grnp.execute(message, 'auto');
        }, 0);

        channels[message.channel.id].interval = undefined;

        channels[message.channel.id].interval = setInterval(() => {
            grnp.execute(message, 'auto');
        }, 15000);
        
    
        //server = servers[message.guild.id];
        
        //play(message, connection, server.queue);
    }
}

/*async function play(message, connection, queue) {
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
    
}*/