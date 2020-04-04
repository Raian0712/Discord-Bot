//Discord API
"use strict";

const Discord = require('discord.js');
const { prefix, ownerID } = require('./config.json');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message=> {
    console.log(message.content);
    const args = message.content.split(" ").slice(1);

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    if (message.content.startsWith(prefix + 'ping')) {
        message.channel.send('\`\`\`pong\`\`\`');
    }
    else if(message.content.startsWith(prefix + 'user')) {
        message.channel.send(`\`\`\`Your user name: ${message.author.username}\nYour ID: ${message.author.id}\`\`\``);
    }
    else if(message.content.startsWith(prefix + 'close')) {
        message.channel.send(`\`\`\`Closing..\`\`\``);
        process.exit();
    }
    else if(message.contentstartsWith(prefix + 'code')) {
        if (message.author.id !== ownerID) return;
        try {
            const code = args.join(" ");
            console.log("code = " + code);
            let evaled = eval(code);

            if(typeof evaled !== "string") {
                evaled = require("util").inspect(evaled);
            }

            message.channel.send(clean(evaled), {code: "xl"});
        } catch (error) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(error)}\n\`\`\``)
        }
    }
});

function clean(text) {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }

client.login(process.env.TOKEN);