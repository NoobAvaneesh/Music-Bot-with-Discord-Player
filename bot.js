var a = require("@discordjs/opus")
var b = require("discord-player")
var c = require("discord.js")
var d = require("ffmpeg-static")
var e = require("public-ip")
var f = require("ytdl-core")
var g = require("fs")
var h = require("ytdl-core")
var i = require("@discord-player/extractor");
var url = require("url");
const ytdl = require('ytdl-core');
const publicIp = require('public-ip');

let getContents = require("github_repository_scraper");


const http = require('http');

const fs = require('fs');


const Discord = require("discord.js"),
    client = new Discord.Client(),
    settings = {
        prefix: "?!",
        token: "Your-bot-token",
        ownerID: "your-id",
        ip: "your-ip",
        port: your-port //can be 443 or 80 or 8080 or every other port.
    };

http.createServer((req, res) => {
    let responseCode = 404;
    let content = '404 Error';

    var videopos = (req.url).indexOf("videos")

    if (req.url === '/') {
        responseCode = 200;
        content = fs.readFileSync('./index.html');
        res.end(content);
    }

    if (videopos === 1) {



        var adress = "." + req.url + ".mp4"
        fs.readFile(adress, function (err, content) {
            if (err) {
                console.error(err);
                return;
            }
            else {
                res.writeHead(200, { "content-type": "video/mp4" });
                res.end(content);
            }
        })

    }



})
    .listen(settings.port);











const { Player } = require("discord-player");
// Create a new Player (you don't need any API Key)
const player = new Player(client);
// To easily access the player
client.player = player;
// add the trackStart event so when a song will be played this message will be sent
var test;
client.on('messageDelete', async (message) => {



    var allInfo = message
    var useFull = allInfo.author.username + "#" + allInfo.author.discriminator + "\n" + allInfo.content
    // directory path
    const dir = './snipe/' + message.guild.id;

    // create new directory
    await fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) {
            throw err;
        }
        console.log("Directory is created.");
    });
    var file = ("./snipe/" + message.guild.id + "/" + message.channel.id)
    fs.writeFile((file + ".txt"), useFull, (err) => {
        // throws an error, you could also catch it here
        if (err) {
            throw err;
        }
        // success case, the file was saved
        console.log('Done');
    });

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

        test.delete();
    }
    test = msg

}))



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

    if (command === "help") {
        var content = (
            settings.prefix + "av (@member) - Let the bot show an avatar.\n" +
            settings.prefix + "say [text] - Let the bot say something you type.\n" +
            settings.prefix + "esay [text] - Let the bot say something you type in embed.\n" +
            settings.prefix + "games - Show universal join commands for games.\n" +
            settings.prefix + "av-server - Show the server avatar. \n" +
            settings.prefix + "serverinfo - Shows a lot of info about the current server. \n" +
            settings.prefix + "snipe - Shows the last deleted message in a channel. \n" +
            settings.prefix + "nick [text] - Change your nickname.\n" +
            settings.prefix + "m - Get all the music commands.\n" +
            settings.prefix + "help - Shows this.");

        const helpEmbed = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setTitle('Help')
            .setTimestamp()
            .setDescription(content)
            .setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")

        message.channel.send(helpEmbed);
    }
    if (command === "av") {
        if (message.mentions.members.size == 0) {
            var avatarAuthor = message.author.avatarURL();
            message.channel.send(avatarAuthor + " \n" + message.author.username + " does this because " + message.author.username + " is bored");
        }
        if (message.mentions.members.size > 0) {
            var avatarMention = message.mentions.members.first().user.avatarURL()
            message.channel.send(avatarMention);
        }
    }
    if (command === "say") {
        var user = message.author.username
        message.channel.send(user + " says" + "\n" + argAll);
    }
    if (command === "esay") {
        var user = message.author.username
        const esayEmbed = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setTitle(user + " says")
            .setTimestamp()
            .setDescription(argAll)
            .setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")
        message.channel.send(esayEmbed);

    }
    if (command === "games") {
        var gamesContent = ("Among us: steam:\/\/rungameid/945360 \n" +
            "ARK: steam: \/\/rungameid/346110 \n" +
            "Rocketleague: steam: \/\/rungameid/252950 \n" +
            "Krunker.io: https://krunker.io/ \n" +
            "Steam version of krunker: steam: \/\/rungameid/1408720")
        message.channel.send(gamesContent)

    }
    if (command === "av-server") {
        var serverIcon = message.guild.iconURL()
        message.channel.send(serverIcon)
    }
    if (command === "serverinfo") {

        var guild = message.guild

        var id = guild.id
        var name = guild.name
        var icon = message.guild.iconURL()
        var region = guild.region
        var memberCount = guild.memberCount
        var afkTimeout = guild.afkTimeout

        var afkChannelID = guild.afkChannelID
        var nameAfkChannel = message.guild.channels.cache.get(afkChannelID)

        var systemChannelID = guild.systemChannelID
        var nameSystemChannel = message.guild.channels.cache.get(systemChannelID)

        var verificationlevel = guild.verificationLevel
        var maxiumMembers = guild.maximumMembers

        var rulesChannelID = guild.rulesChannelID
        var nameRulesChannel = message.guild.channels.cache.get(rulesChannelID)

        var publicUpdatesChannelID = guild.publicUpdatesChannelID
        var namePublicUpdatesChannel = message.guild.channels.cache.get(publicUpdatesChannelID)

        var prefferedLocale = guild.preferredLocale


        const serverEmbed = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setTitle('Serverinfo')
            .setTimestamp()
            .setThumbnail(icon)
            .addFields(
                { name: 'guildID', value: id, inline: true },
                { name: 'Guild Name', value: name, inline: true },
                { name: 'Region', value: region, inline: true },
                { name: 'Members', value: memberCount, inline: true },
                { name: 'Afk Timout', value: afkTimeout + "s", inline: true },
                { name: 'Afk Channel', value: nameAfkChannel, inline: true },
                { name: 'SystemChannel', value: nameSystemChannel, inline: true },
                { name: 'verificationlevel', value: verificationlevel, inline: true },
                { name: 'maxiumMembers', value: maxiumMembers, inline: true },
                { name: 'Ruleschannel', value: nameRulesChannel, inline: true },
                { name: 'Staff updates channel', value: namePublicUpdatesChannel, inline: true },
                { name: 'prefferedLocale', value: prefferedLocale, inline: true },
            )
            .setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")

        message.channel.send(serverEmbed);



    }
    if (command === "snipe") {
        const fs = require('fs');
        fs.readFile("./snipe/" + message.guild.id + "/" + message.channel.id + ".txt", 'utf8', function (err, data) {
            if (err) {
                message.channel.send("There is nothing to snipe")
            }
            else {
                var string = data,
                    author = string.split("\n")[0]
                content = string.slice(author.length)


                const snipeEmbed = new Discord.MessageEmbed()
                    .setColor('#00FF00')
                    .setTitle(message.author.username + ' sniped ' + author)
                    .setTimestamp()
                    .setDescription(author + " said \n" + content)
                    .setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")

                message.channel.send(snipeEmbed);
            }
        });



    }
    if (command === "nick") {
        if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) return message.channel.send('I don\'t have permission to change your nickname!');
        var id = message.author

        message.member.setNickname(argAll).catch(Error).then(message.channel.send("Your role is to high for me"));




    }


    if (command === "music" || command === "m") {
        var musicContent = (
            settings.prefix + "play <title|URL|subcommand> - plays the provided song. Subcommand: " + settings.prefix + "p \n" +
            settings.prefix + "skip - Skips the current song \n" +
            settings.prefix + "stop - Stops playing and clears the queue \n" +
            settings.prefix + "queue - Shows the current queue. Subcommand: " + settings.prefix + "q \n" +
            settings.prefix + "remove <position> - Removes a song from the queue. Subcommand: " + settings.prefix + "r \n" +
            settings.prefix + "volume <new volume> - Changes the volume from 100% to your new volume. Subcommand: " + settings.prefix + "vol \n" +
            settings.prefix + "loop - Loops the queue. \n" +
            settings.prefix + "nowplaying - Shows the song that is currently playing. Subcommand: " + settings.prefix + "np \n" +
            settings.prefix + "lyrics - Get the lyrics from a song or from the song currently playing. \n" +
            settings.prefix + "download - Download a YouTube video."
            )

        const musicEmbed = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setTitle('Music')
            .setTimestamp()
            .setDescription(musicContent)
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
        if (client.player.getQueue(message) != undefined) {

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
                .setDescription(result)
                .setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")

            message.channel.send(queueEmbed);
            // as we registered the event above, no need to send a success message here
        }
        else {
            message.channel.send("There is nothing in the queue.")
        }
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
        if (number >= 500) {
            client.player.setVolume(message, 500);
            const volumeEmbed = new Discord.MessageEmbed()
                .setColor('#00FF00')
                .setTitle("I changed the volume to " + 500 + ".")
                .setTimestamp()
                .setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")
            message.channel.send(volumeEmbed);
        }
        else {
            client.player.setVolume(message, number);
            const volumeEmbed = new Discord.MessageEmbed()
                .setColor('#00FF00')
                .setTitle("I changed the volume to " + number + ".")
                .setTimestamp()
                .setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")
            message.channel.send(volumeEmbed);
        }

    }
    if (command === "loop") {
        if (client.player.getQueue(message) != undefined) {

            var queue = (client.player.getQueue(message)).loopMode
            var song = (client.player.getQueue(message)).repeatMode

            if (queue == false && song == false) {

                client.player.setLoopMode(message, true)
                const loopFalseEmbed = new Discord.MessageEmbed()
                    .setColor('#00FF00')
                    .setTitle("The queue is now looping.")
                    .setTimestamp()
                loopFalseEmbed.setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")
                message.channel.send(loopFalseEmbed);
            }
            else if (queue == true && song == false) {
                client.player.setLoopMode(message, false)
                client.player.setRepeatMode(message, true)
                const songLoopEmbed = new Discord.MessageEmbed()
                    .setColor('#00FF00')
                    .setTitle("The song is now looping.")
                    .setTimestamp()
                    .setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")
                message.channel.send(songLoopEmbed);


            }

            else {
                client.player.setRepeatMode(message, false)
                client.player.setLoopMode(message, false)
                const loopTrueEmbed = new Discord.MessageEmbed()
                    .setColor('#00FF00')
                    .setTitle("I disabled loop mode.")
                    .setTimestamp()
                loopTrueEmbed.setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")
                message.channel.send(loopTrueEmbed);
            }


        }
    }
    if (command === "nowplaying" || command === "np") {
        if (client.player.getQueue(message) != undefined) {



            var progressBar = client.player.createProgressBar(message, { timecodes: true })
            console.log(progressBar)
            var a = client.player.nowPlaying(message);
            var title = a.title
            var url = a.url
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
                    { name: '\u200b', value: progressBar },
                    { name: "From", value: author, inline: true },
                    { name: "Queue is looped: ", value: loopMode, inline: true }
                )
                .setTimestamp()
                .setFooter("From Playlist: " + fromPlaylist);

            message.channel.send(nowPlayingEmbed);
        }
    }
    if (command === "lyrics" || command === "l") {
        const { Lyrics } = require("@discord-player/extractor");


        if (argAll.length !== 0) {


            var infoLyrics = await (Lyrics(argAll))

            if (infoLyrics.length == 0) {
                message.channel.send("I could not get any data from your input.")
            }
            else {
                message.channel.send(infoLyrics.title + " from " + infoLyrics.artist.name);
                message.channel.send(infoLyrics.lyrics)
            }


        }
        if (argAll.length === 0) {


            if (client.player.getQueue(message) != undefined) {



                var a = client.player.nowPlaying(message)
                var infoLyrics = await (Lyrics(a.title))
                if (infoLyrics.length == 0) {
                    message.channel.send("I could not get any data from your input.")
                }
                else {
                    message.channel.send(infoLyrics.title + " from " + infoLyrics.artist.name);
                    message.channel.send(infoLyrics.lyrics)
                }

            }
            else {
                message.channel.send("I could not get any data from your input.")
            }
        }
    }

    if (command === "download") {
        var fs = require("fs")
        var id = message.author.id
        const dir = ('./videos/')
        try {
            // first check if directory already exists
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
                console.log("Directory is created.");
            } else {
                console.log("Directory already exists.");
            }
        } catch (err) {
            console.log(err);
        }

        var argID = args[0].split("=")[1].length
        console.log(argID)
        if (argID != 11) {
            message.channel.send("I coudnt get any data from " + argID)
            return;

        }
        else {
            (ytdl(args[0]).pipe(fs.createWriteStream("./videos/" + id + ".mp4")));

            message.author.send("Go to http://" + settings.ip + ":" + settings.port + "/videos/" + id + "\n to download your video");
        }

    }




});

client.on("ready", function () {
    client.user.setActivity("My prefix is " + settings.prefix + " | Use " + settings.prefix + "help").catch(console.error);
    console.log("READY FOR ACTION!");
});


getContents('Wolletje01', 'Music-Bot-with-Discord-Player', '/', [], "t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").then(dump => {

    var fithFile = dump[5]
    console.log(fithFile)
    if (fithFile.src !== undefined) {
        setTimeout(function () {
            if (fithFile.src != "4\n") {
                console.log("There is a new version of the bot")
                var ownerid = settings.ownerID
                var user = client.users.cache.get(ownerid)
                user.send("There is a new version of the bot. Check it out on GithHub. \n https://github.com/Wolletje01/Music-Bot-with-Discord-Player/releases/")
            }
        }, 10000);
    }
});


client.login(settings.token);
