const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();

client.commands = new Discord.Collection();

// Production token file (netlify.toml)
const { prefix, token } = require('./netlify.toml');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

const swearWords = ['lmao', 'imao', '1mao', '|MAO', '!mao'];

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {

    if (swearWords.some(word => message.content.toLowerCase().includes(word)) && !message.author.bot) {

        // Store message with ilegal string
        const censoredString = message.content;
        // Delete user message
        message.delete();
        // Send message as spoiler (censored)
        message.channel.send(`message from ${message.author.username}: ||${censoredString}||`);
    }

    if (message.content.includes(`${prefix}start`)) {
        message.channel.send('once in ages past people lived in much happier times.  People were so joys and full of laughter that they laughed all the time until some died.  Humour became such an illness that it was the leading cause of death.  A league of ****police was created to subvert the amount of laughter to bring down the death toll.  The good work of the ****police has helped curve society to safer times.  I am one in that league');
    }

	const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    try {
        client.commands.get(commandName).execute(message, args);
    }
    catch (error) {
        console.log(error);
        message.reply('there was an error');
    }
});

client.login(token);
