"use strict";

//

// Define API key
var APIKEY = process.env.APIKEY


// Dotenv Config
const dotenv = require('dotenv');
dotenv.config();

//Fetch config
const fetch = require('node-fetch');

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

//Embed function

function embed(data, channel) {
    console.log(data)
    const exampleEmbed = new Discord.MessageEmbed()
    .setColor('#5863f8')
    .setTitle('URL Report')
    .setDescription('A detailed report on the safety of your URL')
    .addField('\u200b', '\u200b')
    .addFields(
        
        { name: 'Maliciousness score: (0-100) (lower is safer)', value: `${data.verdicts.urlscan.score}` },
        { name: 'View the full result:', value: `https://urlscan.io/result/${data.task.uuid}`},
        { name: `Website screenshot:`, value: `The website may be in a foreign language due to server locations, this will most likely not be the case if you visit the site.`}
    )
    .setImage(`https://urlscan.io/screenshots/${data.task.uuid}.png`)
    .setTimestamp()
    .setFooter('Powered by urlscan.io', 'https://i.imgur.com/GKxI8lY.png');

    channel.send(exampleEmbed);
}

// Message listener

client.on('message', message => {
    if(message.author.bot) return;
    else if (message.content.includes('https://tenor.com')) return;
    else if (message.content.includes('https://media.discordapp.net')) return;
    else if (message.content.includes('https://')) {
        message.channel.send('Link detected! Beginning Scan...');
        var messageLink = (findUrls(message.content))
        
        // This is the submit fetch
        fetch("https://urlscan.io/api/v1/scan/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "API-Key": process.env.APIKEY
            },
            body: JSON.stringify({
                url: `${messageLink}`,
                visibility: "public"
            })
        }).then(response => response.json()).then((data) => {
            message.channel.send('URL submitted!')
            console.log('Submission fetch successful', data)

            message.channel.send('Retrieving scan data, click at your own risk...')

            // This is the response fetch
            setTimeout(function() {
                fetch(`https://urlscan.io/api/v1/result/${data.uuid}/`).then(response => response.json()).then(data => {
                if (data.status == 404) {
                    message.channel.send(`The page wasn't found. This may be an error on our side, you can retry if you wish`)
                } else {
                embed(data, message.channel)
                }
                })
                console.log('Result fetch successful')
            }, 20000);

    
        })
                
            }
        });