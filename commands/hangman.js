const Discord = require('discord.js');
const words = require('../words.json');
const {prefix} = require('../config.json');
const channels = {};
const category = ['Country', 'Capital City', 'Food', 'Movie', 'Band', 'Animal', 'Computer', 'Compound Word', 'Pokemon'];

module.exports = {
    name: 'hangman',
    description: 'Plays a game of hangman.',
    usage: '',
    category: 'general',
    async execute(message, args) {
        if(!channels[message.channel.id]) {
            channels[message.channel.id] = {
                playWord: '',   //The word currently played
                wordlength: 0,  //Word length
                guessLength: 0, //Guessed character length
                guessChar: [],  //Guessed character list
                displayWord: [],//Data used to display _ _ _ _
                gameOn: false,  //Is the game on?
                life: 10,       //Player life
                input: 0,       //For choosing category
            };
        }
        const hangmanMenu = new Discord.MessageEmbed()
            .setTitle(`Hangman Menu`)
            .setColor(message.member.displayHexColor)
            .setTimestamp()
            .setDescription(`
                1. Country
                2. Capital City
                3. Food
                4. Movie
                5. Band
                6. Animal
                7. Computer
                8. Compound Words
                9. Pokemon

                Choose your options with \`${prefix}hangman [1-9].\` 
            `);

        if (args.length == 1 && !channels[message.channel.id].gameOn) {
            if (!Number.isNaN(args[0]) && Number.isInteger(parseInt(args[0])) && args[0] >= 1 && args[0] <= 9) {
                channels[message.channel.id].input = parseInt(args[0]);
                //Get random word based on category
                switch (channels[message.channel.id].input) {
                    case 1: {
                        channels[message.channel.id].playWord = selectWord(words.country);
                        break;
                    }
                    case 2: {
                        channels[message.channel.id].playWord = selectWord(words.capitalcity);
                        break;
                    }
                    case 3: {
                        channels[message.channel.id].playWord = selectWord(words.food);
                        break;
                    }
                    case 4: {
                        channels[message.channel.id].playWord = selectWord(words.movie);
                        break;
                    }
                    case 5: {
                        channels[message.channel.id].playWord = selectWord(words.band);
                        break;
                    }
                    case 6: {
                        channels[message.channel.id].playWord = selectWord(words.animal);
                        break;
                    }
                    case 7: {
                        channels[message.channel.id].playWord = selectWord(words.computer);
                        break;
                    }
                    case 8: {
                        channels[message.channel.id].playWord = selectWord(words.compoundWord);
                        break;
                    }
                    case 9: {
                        channels[message.channel.id].playWord = selectWord(words.pokemon);
                        break;
                    }
                }

                //Calculate actual character length without space
                //Display play word (debug) and sets display word array
                console.log(channels[message.channel.id].playWord);
                for (const i in channels[message.channel.id].playWord) {
                    if (channels[message.channel.id].playWord[i] != ' ') {
                        channels[message.channel.id].wordlength++;
                        channels[message.channel.id].displayWord.push('_');
                    } else {
                        channels[message.channel.id].displayWord.push(' ');
                    }
                
                }

                message.channel.send(`Category Chosen: ${category[channels[message.channel.id].input - 1]}.\`\`\`${channels[message.channel.id].displayWord.join(' ')}\`\`\``);
                channels[message.channel.id].gameOn = true;
            } else {
                message.channel.send("Wrong selection.");
            }
        } else if (args.length == 0 && !channels[message.channel.id].gameOn) {
            return message.channel.send(hangmanMenu);
        }

        if (channels[message.channel.id].gameOn) {
            if (args[0] == 'guess') {
                //console.log(args[1]);
                //console.log(args[1].length);
                if (args[1].length == 1) {
                    if (channels[message.channel.id].playWord.includes(args[1])) {
                        channels[message.channel.id].guessChar.push(args[1]);
                        for (const i in channels[message.channel.id].playWord) {
                            if (channels[message.channel.id].playWord[i] == args[1]) {
                                channels[message.channel.id].displayWord[i] = channels[message.channel.id].playWord[i];
                                channels[message.channel.id].guessLength++;
                            }
                        }
    
                        //console.log(parseInt(channels[message.channel.id].wordlength));
                        //console.log(parseInt(channels[message.channel.id].guessLength));
    
                        if (parseInt(channels[message.channel.id].wordlength) == parseInt(channels[message.channel.id].guessLength)) {
                            message.channel.send(`<@${message.member.id}> won!\nThe word was \`${channels[message.channel.id].playWord}\`.`);
                            return resetGame(message);
                        }
                    } else {
                        channels[message.channel.id].life--;
                        if (channels[message.channel.id].life == 0) {
                            message.channel.send(`You lose!\nThe word was \`${channels[message.channel.id].playWord}\`.`);
                            return resetGame(message);
                        } else {
                            channels[message.channel.id].guessChar.push(args[1]);
                        }
                        
                    }
                
                } else if (args[1].length > 1) {
                    return message.channel.send("Only one character allowed for guess!");
                } 
    
                message.channel.send(`${channels[message.channel.id].life} lives remaining.\nCharacters guessed: ${channels[message.channel.id].guessChar.join(', ')}`);
                message.channel.send(`\`\`\`${channels[message.channel.id].displayWord.join(' ')}\`\`\``);
            } else if (args[0] == 'solve') {
                //Joins the 'guess answer as a string'
                args.shift();
                var answer = args.join(' ');

                //Checks if guessed answer is the same as the play word
                if (channels[message.channel.id].playWord == answer) {
                    for (const i in channels[message.channel.id].playWord) {
                        channels[message.channel.id].displayWord[i] = answer[i];
                    }
                    message.channel.send(`<@${message.member.id}> won!\nThe word was \`${channels[message.channel.id].playWord}\`.`);
                    resetGame(message);
                } else {
                    for (const i in channels[message.channel.id].playWord) {
                        if (channels[message.channel.id].playWord[i] == args[1]) {
                            channels[message.channel.id].displayWord[i] = channels[message.channel.id].playWord[i];
                            channels[message.channel.id].guessChar++;
                        }
                    }

                    message.channel.send(`Invalid guess!`);
                    channels[message.channel.id].life--;
                    message.channel.send(`${channels[message.channel.id].life} lives remaining.\nCharacters guessed: ${channels[message.channel.id].guessChar.join(', ')}`);
                    message.channel.send(`\`\`\`${channels[message.channel.id].displayWord.join(' ')}\`\`\``);
                }
            } else if (args[0] == 'cancel') {
                message.channel.send("Game cancelled");
                resetGame(message);
            }
        } else {
            message.channel.send("Game not initialized yet!");
        }
        
    }
}

function selectWord(words) {
    var word = words[Math.floor(Math.random() * words.length)];
    
    return word;
}

function resetGame(message) {
    channels[message.channel.id].playWord = '';
    channels[message.channel.id].guessChar = [];
    channels[message.channel.id].displayWord = [];
    channels[message.channel.id].wordlength = 0,
    channels[message.channel.id].guessLength = 0,

    channels[message.channel.id].gameOn = false;
    channels[message.channel.id].life = 10;
    channels[message.channel.id].input = 1;
}