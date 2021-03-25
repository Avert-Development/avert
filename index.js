// Dotenv Config
const dotenv = require('dotenv');
dotenv.config();

// Config.json
const config = require('./config.json');

// Require dicord.js module
const Discord = require('discord.js');
// Require fs moduke
const fs = require('fs');
// Create a new discord client
const client = new Discord.Client();

// When the client is ready, run this code
// This even will only trigger once after logging in
client.once('ready', () => {
    console.log('Ready!');
});

// logging in with the token
client.login(process.env.TOKEN);

// Convert Function
function findUrls( text )
{
    var source = (text || '').toString();
    var urlArray = [];
    var url;
    var matchArray;

    // Regular expression to find FTP, HTTP(S) and email URLs.
    var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;

    // Iterate through any URLs in the text.
    while( (matchArray = regexToken.exec( source )) !== null )
    {
        var token = matchArray[0];
        urlArray.push( token );
    }

    return urlArray;
}

// Message listener

client.on('message', message => {
    if(message.author.bot) return;
    else if (message.content.includes('https://')) {
        message.channel.send('Link detected! Beginning Scan...');
        var messageLink = (findUrls(message.content))
        message.channel.send("`" + "Your parsed URL: " + messageLink + "`")
    }
});