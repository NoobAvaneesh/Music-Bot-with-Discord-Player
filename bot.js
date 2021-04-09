var a = require("@discordjs/opus")
var b = require("discord-player")
var c = require("discord.js")
var d = require("ffmpeg-static")
var e = require("public-ip")
var f = require("ytdl-core")

let getContents = require("github_repository_scraper");






const Discord = require("discord.js"),
    client = new Discord.Client(),
    settings = {
        prefix: "?!",
        token: "BOT-TOKEN",
        ownerID: "OWNER-ID"
    };

const { Player } = require("discord-player");
// Create a new Player (you don't need any API Key)
const player = new Player(client);
// To easily access the player
client.player = player;
// add the trackStart event so when a song will be played this message will be sent
var test;
var messageDelete;
client.on('messageDelete', (message) => {
    if (message.author.bot != true) {
        
        console.log(message.author.bot)
        messageDelete = message 
    }
})

client.player.on('trackAdd', (message, queue, track) => {

    const trackAddEmbed = new Discord.MessageEmbed()
        .setColor('#00FF00')
        .setTitle('Added')
        .setDescription(track.title + "\n to the queue")
        .setTimestamp()
        .setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")

    message.channel.send(trackAddEmbed);
})

client.player.on('trackStart', (message, track) => message.channel.send(`Now playing ${track.title}`).then(msg => {

    if (test !== undefined && test !== null) {
        console.log(test)
        test.delete();
    }
    test = msg

}))


    



client.on("ready", () => {
    console.log("I'm ready !");
});

client.player.on('error', (error, message) => {
    switch (error) {
        case 'NotPlaying':
            message.channel.send('There is no music being played on this server!');
            break;
        case 'NotConnected':
            message.channel.send('You are not connected in any voice channel!')
            break;
        case 'UnableToJoin':
            message.channel.send('I am not able to join your voice channel, please check my permissions!')
            break;
        case 'LiveVideo':
            message.channel.send('YouTube lives are not supported!')
            break;
        case 'VideoUnavailable':
            message.channel.send('This YouTube video is not available!');
            break;
        default:
            message.channel.send(`Something went wrong... Error: ${error}`)
    }
})
client.on("message", async (message) => {
    if (!message.content.startsWith(settings.prefix) || message.author.bot) return;
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    var argAll = args.join(" ");




    if (command === "music" || command === "m") {
        const musicEmbed = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setTitle('Music')
            .setTimestamp()
            .setDescription("\n?!play <title|URL|subcommand> - plays the provided song. Subcommand: ?!p \n?!skip - Skips the current song \n?!stop - Stops playing and clears the queue \n?!queue - Shows the current queue. Subcommand: ?!q \n?!remove <position> - Removes a song from the queue. Subcommand: ?!r \n?!volume <new volume> - Changes the volume from 100% to your new volume. Subcommand: ?!vol \n?!loop - Loops the queue. \n?!nowplaying - Shows the song that is currently playing. Subcommand: ?!np")
            .setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")

        message.channel.send(musicEmbed);

    }
    
    if (command === "play" || command === "p") {

        client.player.play(message, argAll, true);
    }
    if (command === "skip") {
        client.player.skip(message);
        const Skipsong = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setTitle('I skipped the current song')
            .setTimestamp()
        Skipsong.setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")

        message.channel.send(Skipsong);
    }
    if (command === "stop") {
        client.player.stop(message);
        const StopEmbed = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setTitle('I stopped playing and cleared the queue.')
            .setTimestamp()
        StopEmbed.setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")

        message.channel.send(StopEmbed);
    }
    if (command === "queue" || command === "q") {


        var queue = (client.player.getQueue(message)).tracks.slice(0, 10);
        var queue1 = [];
        queue.forEach(track => {
            queue1.push(track.title);
            queue1.push(track.url);
        });
        var i;
        var a = 0
        var result = ""
        for (var i = 0; i < queue1.length; i++) {
            var text = "";

            if (i % 2 == false) {
                var b = a++
                var text = b + ": " + "[" + queue1[i] + "]" + "(" + queue1[i + 1] + ")" + "\n"
                result += text
            }
        }
        const queueEmbed = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setTitle('Queue')
            .setTimestamp()
        queueEmbed.setDescription(result);
        queueEmbed.setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")

        message.channel.send(queueEmbed);
        // as we registered the event above, no need to send a success message here
    }
    if (command === "remove" || command === "r") {
        var number = parseInt(args)

        client.player.remove(message, number)

        const removeEmbed = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setTitle("I deleted number" + number)
        removeEmbed.setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")
    }
    if (command === "volume" || command === "vol") {
        var number = parseInt(args)
        client.player.setVolume(message, number);
        const volumeEmbed = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setTitle("I changed the volume to " + number)
            .setTimestamp()
        volumeEmbed.setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")
        message.channel.send(volumeEmbed);
    }
    if (command === "loop") {
        if (client.player.getQueue(message) != undefined) {

            var queue = (client.player.getQueue(message)).loopMode


            if (queue == false) {

                client.player.setLoopMode(message, true)
                const loopFalseEmbed = new Discord.MessageEmbed()
                    .setColor('#00FF00')
                    .setTitle("I enabled loop mode")
                    .setTimestamp()
                loopFalseEmbed.setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")
                message.channel.send(loopFalseEmbed);
            }
            else {

                client.player.setLoopMode(message, false)
                const loopTrueEmbed = new Discord.MessageEmbed()
                    .setColor('#00FF00')
                    .setTitle("I disabled loop mode")
                    .setTimestamp()
                loopTrueEmbed.setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")
                message.channel.send(loopTrueEmbed);
            }


        }
    }
    if (command === "nowplaying" || command === "np") {
        if (client.player.getQueue(message) != undefined) {




            var a = client.player.nowPlaying(message);
            var title = a.title
            var url = a.url
            var duration = a.duration
            var thumbnail = a.thumbnail
            var author = a.author
            var fromPlaylist = a.fromPlaylist
            var loopMode = (client.player.getQueue(message)).loopMode


            const nowPlayingEmbed = new Discord.MessageEmbed()
                .setColor('#007700')
                .setTitle('Now Playing')
                .setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")
                .setThumbnail(thumbnail)
                .addFields(
                    { name: 'Title', value: "[" + title + "]" + "(" + url + ")" },
                    { name: '\u200B', value: '\u200B' },
                    { name: 'Duration', value: duration, inline: true },
                    { name: "From", value: author, inline: true },
                    { name: "Queue is looped: ", value: loopMode, inline: true }
                )
                .setTimestamp()
                .setFooter("From Playlist: " + fromPlaylist);

            message.channel.send(nowPlayingEmbed);
        }
    }

    





});

getContents('Wolletje01', 'Music-Bot-with-Discord-Player', '/', [], "t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").then(dump => {

    var fithFile = dump[5]
    if (fithFile.src !== undefined) {
        setTimeout(function () {
            if (fithFile.src != "2\n") {
                console.log("There is a new version of the bot")
                var ownerid = settings.ownerID
                var user = client.users.cache.get(ownerid)
                user.send("There is a new version of the bot. Check it out on GithHub. \n https://github.com/Wolletje01/Music-Bot-with-Discord-Player/releases/")
            }
        }, 10000);
    }
});


client.login(settings.token);
