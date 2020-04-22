const Discord = require('discord.js');
const Youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core-discord');
const {
    youtubeAPI
} = require('../config.json');
const youtube = new Youtube(youtubeAPI);

let dispatcher;

module.exports = {
    name: 'search',
    description: 'Searches video on YouTube',
    async execute(message, args) {
        const searchLength = 6;
        let choice;
        let data = [];
        let dataVideo = [];
        youtube.searchVideos(args, searchLength).then(results => {
            for (const index in results) {
                data.push(`${parseInt(index) + 1}. ${results[index].title}}`);
                dataVideo.push(`${results[index].url}`);
            }

            message.channel.send(data);
            message.channel.send(`Select which video to play **(1-${data.length})**`);
        })

        const filter = m => {
            return (m.content >= 1 && m.content <= searchLength)
        };

        choice = await message.channel.awaitMessages(filter, {
            time: 6000,
            max: 1,
            errors: ['time']
        }).then(messages => {
            message.channel.send(`You've selected: ${messages.first().content}`);
            return messages.first().content;
        }).catch(() => {
            message.channel.send('You did not enter any input!');
        })

        const connection = await message.member.voice.channel.join();
        console.log(dataVideo);
        console.log(choice);
        let url = dataVideo[choice];
        dispatcher = connection.play(await ytdl(url), {
            filter: "audioonly",
            type: 'opus',
            highWaterMark: 33554432,
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