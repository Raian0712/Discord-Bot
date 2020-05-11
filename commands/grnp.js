const Discord = require('discord.js');
var xml2js = require('xml2js');
var https = require('https');
var parser = new xml2js.Parser();
var songTitle;
var songArtist;
var songAlbum;
var songYear;
var songCircle;

module.exports = {
    name: 'grnp',
    description: 'Shows the song that is playing now (Gensokyo Radio)',
    usage: '',
    category: 'music',
    async execute(message, args) {
        const connection = await message.member.voice.channel.join();

        if (!message.member.voice.channel) {
            message.channel.send('User is not in voice channel! I don\'t know what to play either!');
        }

        parser.on('error', (err) => {
            console.log('Parser error: ', err.stack);
        })

        var data = '';
        https.get(`https://gensokyoradio.net/xml/`, async (res) => {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                res.on('data', (data_) => {
                    data += data_.toString();
                });
                res.on('end', () => {
                    //console.log('Data', data);
                    parser.parseString(data, (err, res) => {
                        if (err) {
                            console.log(err.stack);
                        } else {
                            console.log(res.GENSOKYORADIODATA.SONGINFO[0]);
                            songTitle = decodeEntities(res.GENSOKYORADIODATA.SONGINFO[0].TITLE.join());
                            songArtist = decodeEntities(res.GENSOKYORADIODATA.SONGINFO[0].ARTIST.join());
                            songAlbum = decodeEntities(res.GENSOKYORADIODATA.SONGINFO[0].ALBUM.join());
                            songYear = decodeEntities(res.GENSOKYORADIODATA.SONGINFO[0].YEAR.join());
                            songCircle = decodeEntities(res.GENSOKYORADIODATA.SONGINFO[0].CIRCLE.join());
                        }

                        if (songTitle == '') {
                            songTitle = 'Unknown';
                        }

                        if (songArtist == '') {
                            songArtist = 'Unknown';
                        }

                        if (songAlbum == '') {
                            songAlbum = 'Unknown';
                        }

                        if (songYear == '') {
                            songYear = 'Unknown';
                        }

                        if (songCircle == '') {
                            songCircle = 'Unknown';
                        }

                        const youTubeEmbed = new Discord.MessageEmbed()
                            .setTitle("Now playing")
                            .setColor("#5b64a7")
                            .setTimestamp()
                            .setDescription(`**${songArtist} - ${songTitle}**\n`)
                            .addField('Album', songAlbum)
                            .addField('Year', songYear)
                            .addField('Circle', songCircle);

                        message.channel.send(youTubeEmbed);
                    });
                });
            }
        })




        /*if(server.queue.length >= 1) {
            const youTubeEmbed = new Discord.MessageEmbed()
                .setTitle("Now playing")
                .setColor("#ff0000")
                .setTimestamp()
                .setDescription(`${server.queue[0].title}\n${server.queue[0].url}`);

            message.channel.send(youTubeEmbed);
        }*/


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