const Discord = require('discord.js');
const Youtube = require('simple-youtube-api');
//const ytdl = require('ytdl-core-discord');
const {
    youtubeAPI
} = require('../config.json');
const youtube = new Youtube(youtubeAPI);
const servers = {};
let queue = [];
const youtubeSearch = require('scrape-youtube');
const search = youtubeSearch.search;

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

        let regEx = /https:\/\/www.youtube.com\/watch[?]v=[\w]{11}/;

        //console.log(args);

        if (args[0].match(regEx)) {
            var id = args[0].substring(32);

            if (!servers[message.guild.id]) {
                servers[message.guild.id] = {
                    queue: []
                }
            }

            server = servers[message.guild.id];
            youtube.getVideoByID(id).then(async results => {
                //console.log(results)
                let temp = {
                    url: args[0],
                    title: decodeEntities(results.title)
                }
                //dataVideo.push(temp);
                await server.queue.push(temp);

                return message.channel.send(`You've added ${temp.title} to queue!\nNow the queue has ${server.queue.length} songs.`);
            }).catch(error => {
                console.log(error.stack);
            })
        } else {
            const results = await search(args.join(' '), {
                limit: 5,
                type: 'video'
            });

            for (const index in results) {
                data.push(`${parseInt(index) + 1}. ${decodeEntities(results[index].title)}`);
                let temp = {
                    url: results[index].link,
                    title: decodeEntities(results[index].title),
                    thumbnail: results[index].thumbnail
                }
                dataVideo.push(temp);
            }

            /*youtube.searchVideos(args, searchLength).then(async results => {
                for (const index in results) {
                    data.push(`${parseInt(index) + 1}. ${decodeEntities(results[index].title)}`);
                    let temp = {
                        url: results[index].url,
                        title: decodeEntities(results[index].title)
                    }
                    dataVideo.push(temp);
                }*/

            const selectionEmbed = new Discord.MessageEmbed()
                .setTitle('Search Results')
                .setColor(message.member.displayHexColor)
                .setTimestamp()
                .setDescription(data)
                .addFields({
                    name: '===========================================',
                    value: `Select which video to add to the queue **(1-${dataVideo.length})**`
                }, );

            //await message.channel.send(data);
            //list = await message.channel.send(`Select which video to add to the queue **(1-${dataVideo.length})**`);
            list = await message.channel.send(selectionEmbed);
            await list.react('1️⃣');
            await list.react('2️⃣');
            await list.react('3️⃣');
            await list.react('4️⃣');
            await list.react('5️⃣');

            //1️⃣2️⃣3️⃣4️⃣5️⃣
            const filter = (reaction, user) => {
                return (reaction.emoji.name == '1️⃣' || reaction.emoji.name == '2️⃣' || reaction.emoji.name == '3️⃣' || reaction.emoji.name == '4️⃣' || reaction.emoji.name == '5️⃣') &&
                    user.id === message.author.id;
            }

            choice = await list.awaitReactions(filter, {
                time: 10000,
                max: 1,
                errrors: ['time']
            }).then(collected => {
                const reaction = collected.first();
                console.log(`Collected: ${collected}`);
                console.log(`Reaction: ${reaction}`);
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
                    case '5️⃣': {
                        result = 5;
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
                    console.log(dataVideo);
                    let temp = {
                        url: dataVideo[result - 1].url,
                        title: dataVideo[result - 1].title,
                        thumbnail: dataVideo[result - 1].thumbnail
                    }
                    servers[message.guild.id].queue.push(temp);

                    selectionEmbed.setTitle(`You've selected: ${(result)}`)
                        .setDescription(`You've added ${dataVideo[result - 1].title} to queue!`);

                    selectionEmbed.fields = [];

                    selectionEmbed.addFields({
                        name: '===========================================',
                        value: `Now the queue has ${server.queue.length} songs.`
                    })

                    //queue = server.queue;
                    message.channel.send(selectionEmbed);

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