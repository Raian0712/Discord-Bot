const Discord = require('discord.js');
const Booru = require('booru');
const kn = Booru.forSite('kn');

module.exports = {
    name: 'konachan',
    description: 'Posts from konachan.net. Tags follow konachan.net formats. Otherwise put *',
    usage: '[konachan tags seperated by space (* if everything)]',
    category: 'image',
    async execute(message, args) {
        await sendPic(message, args)
    }
}

async function sendPic(message, args) {
    const youTubeEmbed = new Discord.MessageEmbed()
        .setTitle("Image Searched")
        .setColor(message.member.displayHexColor)
        .setTimestamp();
    
    var searchValue = [];

    for (const i in args) {
        searchValue.push(args[i]);
    }

    var post = await searchPic(searchValue, 1, true);

    if (post != undefined || post != null) {
        youTubeEmbed.setDescription(post.postView);

        console.log(`preview url: ${post.previewUrl}`);
        console.log(`sameple url: ${post.sampleUrl}`);
        console.log(`file url: ${post.fileUrl}`);

        url = post.fileUrl;
        if (url == null) {
            url = post.sampleUrl;
        }

        if (url != null) {
            youTubeEmbed.setImage(url);
        } else {
            youTubeEmbed.setDescription(`${post.postView}\nCannot grab thumbnail from konachan.. Eh..`);
        }

        message.channel.send(youTubeEmbed);
    } else {
        youTubeEmbed.setTitle('Cannot find image!')
            .setDescription('Perharps wrong tag?');

        message.channel.send(youTubeEmbed);
    }
}

async function searchPic(tags, limit = 1, random = true) {
    var postReturn;
    console.log(tags);

    await kn.search(tags, {
        limit,
        random
    }).then(posts => {
        for (const post of posts) {
            postReturn = post;
        }
    });

    return postReturn;
}