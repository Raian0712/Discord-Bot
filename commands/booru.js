const Discord = require('discord.js');
const Booru = require('booru');
const db = Booru.forSite('db');

module.exports = {
	name: 'booru',
    description: 'Search for image in danbooru',
    usage: '[danbooru tag]',
    category: 'image',
	async execute(message, args) {
        const youTubeEmbed = new Discord.MessageEmbed()
                .setTitle("Image Searched")
                .setColor(message.member.displayHexColor)
                .setTimestamp();

        console.log(args);

        db.search(args, {limit: 1, random: true}).then(posts => {
            for (const post of posts) {
                youTubeEmbed.setDescription(post.postView);

                url = post.sampleUrl;
                if (url == null) {
                    url = post.fileUrl;
                }
                

                youTubeEmbed.setImage(url);
            }

            if (url != null) {
                message.channel.send(youTubeEmbed);
            } else {
                message.channel.send("Cannot find any images.");
            }
            
        }).catch((error) => {
            message.channel.send(error.message);
        })
	}
}