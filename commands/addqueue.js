const Discord = require('discord.js');
const Youtube = require('simple-youtube-api');
//const ytdl = require('ytdl-core-discord');
const {
    youtubeAPI
} = require('../config.json');
const youtube = new Youtube(youtubeAPI);
const servers = {};
let queue = [];
//const youtubeSearch = require('scrape-youtube');
//const search = youtubeSearch.search;
const ytsr = require('ytsr');
const ytpl = require('ytpl');
const ytdl = require('ytdl-core');

let searchResultLength = 0;

let dispatcher;

module.exports = {
    name: 'addqueue',
    description: 'Adds video to queue',
    servers: servers,
    usage: `[video search name]`,
    category: 'music',
    async execute(message, args) {
        const searchLength = 5;
        let choice;
        let data = [];
        let dataVideo = [];
        var server;
        var list;

        let regEx = /^https:\/\/www\.youtube\.com\/watch[?]v=[\S]{11}$/;
        let regEx2 = /^https:\/\/youtu\.be\/[\S]{11}$/;

        let regExPL = /^https:\/\/www\.youtube\.com\/playlist[?]list=[\S]{34}$/

        //console.log(args);

        if (!args) {
            console.log("No args");
            return;
        }

        if (args[0].match(regExPL)) {
            if (!servers[message.guild.id]) {
                servers[message.guild.id] = {
                    queue: []
                }
            }

            server = servers[message.guild.id];

            var id = args[0].substring(38, 72);
            var playlistLength;

            const playlistEmbed = new Discord.MessageEmbed()
                    .setTitle(`Adding playlist..`);

            const embedMessage = await message.channel.send(playlistEmbed);

            ytpl(id, async (err, playlist) => {
                if (err) throw err;
                playlistLength = playlist.items.length;
                //console.log(playlist.author.name);
                //console.log(playlist.items.length);
                var startTime = new Date().getTime();
                await Promise.all(playlist.items.map(async video => {
                    var youtubeID = video.url_simple.substring(32, 43);
                    //console.log(`${i}. ${playlist.items[i].url_simple}`);
                    const info = await ytdl.getBasicInfo(youtubeID).catch(e => console.log(e.stack));

                    let time = info.player_response.videoDetails.lengthSeconds;
                    let timeSecond;
                    let timeMinute;

                    if (time >= 60) {
                        timeMinute = Math.floor(time / 60);
                    } else {
                        timeMinute = 0;
                    }

                    if (Math.floor(time % 60) < 10) {
                        timeSecond = "0" + Math.floor(time % 60);
                    } else {
                        timeSecond = Math.floor(time % 60);
                    }

                    let temp = {
                        url: video.url_simple,
                        title: decodeEntities(info.title).replace(/>|\\|\*|_|`|\||~/g, (found, index, input) => '\\' + found),
                        thumbnail: info.player_response.videoDetails.thumbnail.thumbnails[0].url,
                        views: info.player_response.videoDetails.viewCount,
                        duration: `${timeMinute}:${timeSecond}`,
                        uploaded_at: new Date(info.published).toDateString(),
                        channel: info.author.name
                    }

                    servers[message.guild.id].queue.push(temp);
                }));
                var endTime = new Date().getTime();
                var timeDelta = endTime - startTime;

                //console.log(servers[message.guild.id].queue);
                const newSelectionEmbed = new Discord.MessageEmbed()
                    .setTitle(`Playlist added!`)
                    .setDescription(`You've added ${playlistLength} videos to queue!\nTime taken: ${timeDelta / 1000} seconds`)
                    .addField('===========================================', `Now the queue has ${servers[message.guild.id].queue.length} songs.`);

                //message.channel.send(newSelectionEmbed);
                embedMessage.edit(newSelectionEmbed);
            })

        } else if (args[0].match(regEx) || args[0].match(regEx2)) {
            if (args[0].match(regEx)) {
                var id = args[0].substring(32, 43);
            } else if (args[0].match(regEx2)) {
                var id = args[0].substring(17, 28);
            }

            if (!servers[message.guild.id]) {
                servers[message.guild.id] = {
                    queue: []
                }
            }

            server = servers[message.guild.id];

            ytdl.getBasicInfo(id, async (err, info) => {
                if (err) return console.log(err.stack);

                let time = info.player_response.videoDetails.lengthSeconds;
                let timeSecond;
                let timeMinute;

                if (time >= 60) {
                    timeMinute = Math.floor(time / 60);
                } else {
                    timeMinute = 0;
                }

                if (Math.floor(time % 60) < 10) {
                    timeSecond = "0" + Math.floor(time % 60);
                } else {
                    timeSecond = Math.floor(time % 60);
                }

                //console.log(info.player_response.videoDetails.thumbnail.thumbnails[0].url); //Thumbnail
                //console.log(info.title);        //Video title
                //console.log(info.author.name);  //Uploader name
                //console.log(info.player_response.videoDetails.viewCount); //Views
                //console.log(info.player_response.videoDetails.lengthSeconds); //Duration
                //console.log(new Date(info.published).toDateString()); //Uploaded at

                let temp = {
                    url: args[0],
                    title: decodeEntities(info.title).replace(/(?:\n|^)>|\\|\*|_|`|\||~/g, (found, index, input) => '\\' + found),
                    thumbnail: info.player_response.videoDetails.thumbnail.thumbnails[0].url,
                    views: info.player_response.videoDetails.viewCount,
                    duration: `${timeMinute}:${timeSecond}`,
                    uploaded_at: new Date(info.published).toDateString(),
                    channel: info.author.name
                }
                //dataVideo.push(temp);
                await servers[message.guild.id].queue.push(temp);

                const newSelectionEmbed = new Discord.MessageEmbed()
                    .setTitle(`You've selected: ${(result)}`)
                    .setDescription(`You've added ${dataVideo[result - 1].title} to queue!`)
                    .addField('===========================================', `Now the queue has ${servers[message.guild.id].queue.length} songs.`);

                return message.channel.send(newSelectionEmbed);
            })
        } else {
            let filters = await ytsr.getFilters(args.join(' '));
            let filterYTSR = filters.get('Type').find(o => o.name == 'Video').ref;
            const results = (await ytsr(null, {
                safeSearch: false,
                limit: 4,
                nextpageRef: filterYTSR
            })).items;
            //console.log(results);

            for (const index in results) {
                //If the result somehow is blank for some reason
                if (results == []) {
                    return message.channel.send("Something went wrong with searching.");
                }
                if (results[index].title == '') {
                    continue;
                } else {
                    //data.push(`${parseInt(index) + 1}. ${decodeEntities(results[index].title)}`);
                    let temp = {
                        url: results[index].link,
                        title: decodeEntities(results[index].title).replace(/(?:\n|^)>|\\|\*|_|`|\||~/g, (found, index, input) => '\\' + found),
                        thumbnail: results[index].thumbnail,
                        views: results[index].views,
                        duration: results[index].duration,
                        uploaded_at: results[index].uploaded_at,
                        channel: results[index].author.name
                    }
                    dataVideo.push(temp);
                    searchResultLength++;
                }

            }

            const selectionEmbed = new Discord.MessageEmbed()
                .setTitle('Search Results')
                .setColor(message.member.displayHexColor)
                .setTimestamp()


            for (const i in results) {
                selectionEmbed.addField(`${+i + 1}. ${results[i].title}`, `Views: ${results[i].views}\nDuration: ${results[i].duration}\nUploaded At: ${results[i].uploaded_at}\nUploader: ${results[i].author.name}`, true);
                if (i == 1) {
                    selectionEmbed.addField(`_ _`, `_ _`, false);
                }
            }

            selectionEmbed.addFields({
                name: '===============================',
                value: `Select which video to add to the queue **(1-${dataVideo.length})**`
            }, );

            //await message.channel.send(data);
            //list = await message.channel.send(`Select which video to add to the queue **(1-${dataVideo.length})**`);
            const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];

            list = await message.channel.send(selectionEmbed);

            for (const index in reactions) {
                if (index >= results.length) break;
                await list.react(reactions[index]);
            }

            //1️⃣2️⃣3️⃣4️⃣5️⃣
            const filter = (reaction, user) => {
                return (reaction.emoji.name == '1️⃣' || reaction.emoji.name == '2️⃣' || reaction.emoji.name == '3️⃣' || reaction.emoji.name == '4️⃣') &&
                    user.id === message.author.id;
            }

            choice = await list.awaitReactions(filter, {
                time: 10000,
                max: 1,
                errrors: ['time']
            }).then(collected => {
                const reaction = collected.first();
                //console.log(`Collected: ${collected}`);
                //console.log(`Reaction: ${reaction}`);
                var result;

                switch (reaction.emoji.name) {
                    case '1️⃣': {
                        result = 1;
                        break;
                    }
                    case '2️⃣': {
                        result = 2;
                        break;
                    }
                    case '3️⃣': {
                        result = 3;
                        break;
                    }
                    case '4️⃣': {
                        result = 4;
                        break;
                    }
                }
                //message.channel.send(`You've selected: ${(result)}`);

                if (!servers[message.guild.id]) {
                    servers[message.guild.id] = {
                        queue: []
                    }
                }

                server = servers[message.guild.id];

                if (result !== undefined) {
                    //console.log(dataVideo);
                    let temp = {
                        url: dataVideo[result - 1].url,
                        title: dataVideo[result - 1].title.replace(/(?:\n|^)>|\\|\*|_|`|\||~/g, (found, index, input) => '\\' + found),
                        thumbnail: dataVideo[result - 1].thumbnail,
                        views: dataVideo[result - 1].views,
                        duration: dataVideo[result - 1].duration,
                        uploaded_at: dataVideo[result - 1].uploaded_at,
                        channel: dataVideo[result - 1].channel
                    }
                    servers[message.guild.id].queue.push(temp);

                    const newSelectionEmbed = new Discord.MessageEmbed()
                        .setTitle(`You've selected: ${(result)}`)
                        .setDescription(`You've added ${dataVideo[result - 1].title} to queue!`)
                        .addField('===========================================', `Now the queue has ${servers[message.guild.id].queue.length} songs.`);

                    /*selectionEmbed.setTitle(`You've selected: ${(result)}`)
                        .setDescription(`You've added ${dataVideo[result - 1].title} to queue!`);

                    selectionEmbed.fields = [];

                    selectionEmbed.addFields({
                        name: '===========================================',
                        value: `Now the queue has ${server.queue.length} songs.`
                    })*/

                    //console.log(servers[message.guild.id].queue);

                    //queue = server.queue;
                    //message.channel.send(selectionEmbed);
                    list.edit(newSelectionEmbed);

                    //message.channel.send(`You've added ${dataVideo[result - 1].title} to queue!\nNow the queue has ${server.queue.length} songs.`);
                }
                //return (result - 1);
            }).catch((error) => {
                console.log(`Error:\n${error.stack}`);
                message.channel.send('You did not react after 10 seconds or something went wrong!');
                return;
            })


            /*.catch((error) => {
                message.channel.send("Quota expired. Sorry.. Please come back tomrrow!");
            })*/
        }

    }
}

function decodeEntities(encodedString) {
    var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
    var translate = {
        "nbsp": " ",
        "amp": "&",
        "quot": "\"",
        "lt": "<",
        "gt": ">"
    };
    return encodedString.replace(translate_re, function (match, entity) {
        return translate[entity];
    }).replace(/&#(\d+);/gi, function (match, numStr) {
        var num = parseInt(numStr, 10);
        return String.fromCharCode(num);
    });
}