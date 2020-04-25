const Discord = require('discord.js');
const http = require('https');
const fs = require('fs');
const waifu2x = require('waifu2x').default;

module.exports = {
    name: 'waifu2x',
    description: 'Waifu2x. Upload your picture then type the command in the message box.',
    usage: '[upload your picture]',
    category: 'image',
    async execute(message, args) {
        var fileURL;
        const messageEmbed = new Discord.MessageEmbed()
            .setTitle('Scaled Up Image')
            .setColor(message.member.displayHexColor)
            .setTimestamp();
        if (message.attachments) {
            const attachment = (message.attachments).array();
            fileURL = `./images/${attachment[0].name}`;

            const file = fs.createWriteStream(fileURL);
            const request = http.get(`${attachment[0].url}`, function (response) {
                response.pipe(file);
                file.on('finish', async () => {
                    file.close();
                    waifu2x.upscaleImage(`./images/${attachment[0].name}`, `./images/upscaled/${attachment[0].name}`, {
                        scale: 2.0,
                        noise: 2
                    });

                    messageEmbed.attachFiles(`./images/upscaled/${attachment[0].name}`);
                    messageEmbed.setImage(`attachment://${attachment[0].name}`);

                    await message.channel.send(messageEmbed);

                    fs.unlinkSync(`./images/${attachment[0].name}`);
                    fs.unlinkSync(`./images/upscaled/${attachment[0].name}`);

                });
            }).on('error', function (err) {
                fs.unlink(fileURL);
                console.log(err);
            })

        } else {
            console.log('No picture detected');
        }
    }
}