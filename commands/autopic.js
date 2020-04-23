const Discord = require('discord.js');
const {
    prefix
} = require('../config.json');
const Booru = require('booru');
const db = Booru.forSite('db');
const channels = {};
var time = 1 * 60 * 1000;
var timeMinute;
var channel;

module.exports = {
    name: 'autopic',
    description: 'Automatically searches image in danbooru and posts here. Can be filtered by adding paramters at the end. Default on safe.',
    usage: '[danbooru tag] [-safe, -suggestive, -nsfw] [time in minute]',
    category: 'image',
    async execute(message, args) {
        if(!channels[message.channel.id]) {
            channels[message.channel.id] = {
                searchString: '',
                interval: undefined
            };
        }

        time = 1 * 60 * 1000;
        
        if (args[0] != 'stop') {
            if (args[1] == undefined || args[1] == null) {
                message.channel.send("Search parameters did not initialized. Setting to safe by default..");
                channels[message.channel.id].searchString = 'rating:safe';
            } else if (args[1] == '-safe') {
                channels[message.channel.id].searchString = 'rating:safe';
            } else if (args[1] == '-suggestive') {
                channels[message.channel.id].searchString = 'rating:questionable';
            } else if (args[1] == '-nsfw') {
                channels[message.channel.id].searchString = 'rating:explicit';
            } else {
                return message.channel.send("Invalid search parameter at the end. (-safe, -suggestive, -nsfw)");
            }

            console.log(args[2]);

            if (args[2] == undefined || args[2] == null) {
                timeMinute = 20;
            } else if (Number.isInteger(parseInt(args[2]))) {
                timeMinute = args[2];
            } else {
                return message.channel.send("Invalid time input.");
            }

            time = time * timeMinute;

            channel = channels[message.channel.id];

            if (!channels[message.channel.id].interval) {
                message.channel.send(`Auto pics initialized. Wait for ${time / 60000} minute(s) for the following pictures.\nTo stop, type \`${prefix}autopic stop\``);
                //searchPic(message, args);
                channels[message.channel.id].interval = setTimeout(async () => {
                    await sendPic(channels[message.channel.id], message, args)
                }, 0);

                channels[message.channel.id].interval = undefined;

                channels[message.channel.id].interval = setInterval(async () => {
                    await sendPic(channels[message.channel.id], message, args)
                }, time);
                
            } else {
                message.channel.send("Auto pics is already running.");
            }
        }

        if (args[0] == 'stop') {
            message.channel.send("Stopping auto pics..");
            clearInterval(channels[message.channel.id].interval);
            //channel.interval = undefined;
            channels[message.channel.id] = {
                searchString: '',
                interval: undefined
            };
        }
    }
}

async function sendPic(channel, message, args) {
    const youTubeEmbed = new Discord.MessageEmbed()
        .setTitle("Image Searched")
        .setColor(message.member.displayHexColor)
        .setTimestamp();

    //console.log(args);
    var searchValue = args[0];

    //server.interval = test;

    if (searchValue != 'stop') {
        var post = await searchPic(channel, searchValue, 1, true);

        /*while (post.rating != 's') {
            post = await searchPic(searchValue, 1, true);
        }*/

        youTubeEmbed.setDescription(post.postView);

        url = post.sampleUrl;
        if (url == null) {
            url = post.fileUrl;
        }

        if (url != null) {
            youTubeEmbed.setImage(url);
        }

        message.channel.send(youTubeEmbed);
    }
}

async function searchPic(channel, tags, limit = 1, random = true) {
    var postReturn;
    console.log(channel.searchString);
    if (tags == '*') {
        tags = [' '];
    }
    await db.search([`${tags}`, channel.searchString], {limit, random}).then(posts => {
        for (const post of posts) {
            postReturn = post;
        }
    });

    return postReturn;
}