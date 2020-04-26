const Discord = require('discord.js');
const http = require('https');
const fs = require('fs');
const waifu2x = require('waifu2x').default;
const sizeOf = require('image-size');
const {
    google
} = require('googleapis');
const readline = require('readline');
const TOKEN_PATH = 'token.json';

var oAuth2Client;
/* = new google.auth.OAuth2(
    '566613109020-80cs1alj4mqm3ja0d0sgviga1k08sf3e.apps.googleusercontent.com',
    '9uZ-cs6Cauh_iauJTlLk_XKK'
)*/

const SCOPES = "https://www.googleapis.com/auth/drive.file";

const folderID = '18sTchLQoeHzFGVpX6inxQENZ_fppvo0I';

module.exports = {
    name: 'waifu2x',
    description: 'Waifu2x. Upload your picture then type the command in the message box.',
    usage: '[upload your picture]',
    category: 'image',
    async execute(message, args) {
        fs.readFile('credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Drive API.
            authorize(JSON.parse(content), () => {
                console.log("success")
            });
        });

        var fileURL;
        var startTime;
        var stopTime;
        var timeDelta;
        const messageEmbed = new Discord.MessageEmbed()
            .setTitle('Scaled Up Image')
            .setColor(message.member.displayHexColor)
            .setTimestamp();
        if (message.attachments) {
            startTime = new Date().getTime();
            const attachment = (message.attachments).array();
            fileURL = `./images/${attachment[0].name}`;

            message.channel.send("Saving image to local storage..");
            const file = fs.createWriteStream(fileURL);
            const request = http.get(`${attachment[0].url}`, function (response) {
                response.pipe(file);
            }).on('error', function (err) {
                fs.unlink(fileURL);
                console.log(err);
            })

            file.on('finish', async () => {
                file.close();
                await message.channel.send("Upscaling image with waifu2x..");
                //Get original image file size
                const oriStat = fs.statSync(`./images/${attachment[0].name}`);
                waifu2x.upscaleImage(`./images/${attachment[0].name}`, `./images/upscaled/${attachment[0].name}`, {
                    scale: 2.0,
                    noise: 0
                });

                var fileMetadata = {
                    'name': `${attachment[0].name}`,
                    parents: [folderID]
                };

                var media = {
                    mimeType: 'image/png',
                    body: fs.createReadStream(`./images/upscaled/${attachment[0].name}`),
                };

                message.channel.send("Uploading result photo to Google Drive..");

                const drive = google.drive({
                    version: "v3",
                    auth: oAuth2Client
                })

                var fileLink;

                await drive.files.create({
                    resource: fileMetadata,
                    media: media,
                    fields: 'id'
                }).then(async () => {
                    //console.log(res);
                    await drive.files.list({
                        q: `name = '${attachment[0].name}'`
                    }).then((res) => {
                        //console.log(res.data.files[0]);
                        if (res.data.files[0].id) {
                            fileLink = `https://drive.google.com/uc?id=${res.data.files[0].id}`;
                        }

                        //messageEmbed.attachFiles(`./images/upscaled/${attachment[0].name}`);
                        //messageEmbed.setImage(`attachment://${attachment[0].name}`);
                        messageEmbed.setImage(fileLink);

                        //Get upscaled image info
                        const dimension = sizeOf(`./images/upscaled/${attachment[0].name}`);
                        const returnStat = fs.statSync(`./images/upscaled/${attachment[0].name}`);

                        stopTime = new Date().getTime();
                        timeDelta = stopTime - startTime;

                        messageEmbed.addField('Time Taken', `${timeDelta / 1000} second(s)`);
                        messageEmbed.addField(`Old Size`, `${attachment[0].width}x${attachment[0].height}    (${Math.ceil(oriStat.size / 1024)} KB)`);
                        messageEmbed.addField(`New Size`, `${dimension.width}x${dimension.height}    (${Math.ceil(returnStat.size / 1024)} KB)`);
                        messageEmbed.addField(`Download Link`, fileLink);

                        try {
                            message.channel.send(messageEmbed);
                        } catch (error) {
                            console.log(error);
                            message.channel.send("Resulting image too big to send!");
                        }
                        //Deletes both file after finish
                        message.channel.send("Deleting both images from local storage..");
                        fs.unlinkSync(`./images/${attachment[0].name}`);
                        fs.unlinkSync(`./images/upscaled/${attachment[0].name}`);
                    })
                })


            });

        } else {
            console.log('No picture detected');
        }
    }
}

function authorize(credentials, callback) {
    const {
        client_secret,
        client_id,
        redirect_uris
    } = credentials.installed;
    oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}