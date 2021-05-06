var a = require("@discordjs/opus")


const ytdl = require('ytdl-core');
let getContents = require("github_repository_scraper");
const fs = require('fs');
const { Lyrics } = require("@discord-player/extractor");
const express = require("express");
const { Player } = require("discord-player");
const empty = require('empty-folder');

const Discord = require("discord.js"),
    client = new Discord.Client(),
    settings = {
        prefix: "?!", 
        token: "xxxxxxxxx", // "NzU3XXXXXXXXXXXXX.XXXX.XXXXXXXXX"
        ownerID: "xxxxxxxxx", // "000000000000000000"
        maxVolume: xxx, // 300 or 500 or 100
        ip: "xxxxxxxxx", // "https://aajie-vps-my.woutervan17.repl.co"
        port: 443, // 433 or 80 or 8080 or 8000
        botInviteLink: "xxxxxxxxx", // "https://discord.com/oauth2/authorize?client_id=757161884528148500&scope=bot&permissions=8"
        supportServer: "xxxxxxxxx" //"https://discord.com/invite/5NTcsahFBh"
    };




const app = express();


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/videos/*", function (req, res) {
    var path = "." + req.url

    // Ensure there is a range given for the video

    const range = req.headers.range;

    if (!range) {
        res.status(400).send("Requires Range header");
    }

    // get video stats (about 61MB)

    const videoPath = path;
    const videoSize = fs.statSync(videoPath).size;

    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);



    // Create headers
    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
});

app.listen(settings.port, function () {
    console.log("Listening on port " + settings.port + "!");
});









// Create a new Player (you don't need any API Key)
const player = new Player(client, { leaveOnEnd: false, leaveOnStop: true, leaveOnEmpty: true, leaveOnEmptyCooldown: 20000, autoSelfDeaf: true });
// To easily access the player
client.player = player;
// add the trackStart event so when a song will be played this message will be sent


client.player.on('trackAdd', async (message, queue, track) => {

    const trackAddEmbed = new Discord.MessageEmbed()
        .setColor('#00FF00')
        .setTitle('Added')
        .setDescription(track.title + "\n to the queue")
        .setTimestamp()
        .setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")

    message.channel.send(trackAddEmbed);
})

client.player.on('trackStart', async (message, track) => {

    var sended = await message.channel.send(`Now playing ${track.title}`)
    var allInfo = (sended.id + "\n" + sended.channel.id + "\n" + sended.guild.id)

    var file = ("./track/" + message.guild.id)
    await fs.readFile("./track/" + message.guild.id + ".txt", 'utf8', async (err, data) => {
        if (err) {

            await fs.writeFile((file + ".txt"), allInfo, (err) => {
                // throws an error, you could also catch it here
                if (err) {
                    throw err;
                }
                // success case, the file was saved

            });
        }
        else {

            var dataSplit = fs.readFileSync("./track/" + message.guild.id + ".txt").toString().split("\n");
            var messageThatAlreadyWasSend = dataSplit[0];
            var channelId = dataSplit[1]


            var channelX = client.channels.cache.get(channelId)
            if (channelX != undefined) {
                var messageX = channelX.messages.cache.get(messageThatAlreadyWasSend)
                if (messageX != undefined) {
                    messageX.delete()

                }
            }

            fs.writeFile((file + ".txt"), allInfo, (err) => {
                // throws an error, you could also catch it here
                if (err) {
                    throw err;
                }
                // success case, the file was saved

            });
        }
    });






    // directory path


    // create new directory


})


client.player.on("playlistAdd", async (message) => { message.channel.send("Added your playlist to the queue") })

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

client.on("ready", async function () {
   
    const dir1 = './track/'
    const dir2 = './playlist/'
    const dir3 = './videos/'



   
    await fs.mkdir(dir1, { recursive: true }, (err) => {
        if (err) {
            throw err;
        }
        console.log("Directory is created.");
    });

    await fs.mkdir(dir2, { recursive: true }, (err) => {
        if (err) {
            throw err;
        }
        console.log("Directory is created.");
    });

    await fs.mkdir(dir3, { recursive: true }, (err) => {
        if (err) {
            throw err;
        }
        console.log("Directory is created.");
    });

    client.user.setActivity("My prefix is " + settings.prefix + " | Use " + settings.prefix + "help").catch(console.error);
    console.log("READY FOR ACTION!");


    empty('./track', false, (o) => {
        if (o.error) console.error(o.error);
        //console.log(o.removed);
        //console.log(o.failed);
    });
});


client.on("message", async (message) => {
    if (!message.content.startsWith(settings.prefix) || message.channel.type === "dm" || message.author.bot == true) return;
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    var argAll = args.join(" ");

    if (command === "ping") {
        message.channel.send("Calculating ping....").then((resultMessage) => {
            const ping = resultMessage.createdTimestamp - message.createdTimestamp

            message.reply("Bot latency: " + ping + "ms , API Latency: " + client.ws.ping + "ms")
        })


    }
    if (command === "invite") {
        message.channel.send("Click on the link below to invite this bot to your server. \n " + settings.botInviteLink)
        message.channel.send("Click on the link below to go to my support guild \n " + settings.supportServer)

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
            settings.prefix + "shuffle - Shuffles the queue. \n" +
            settings.prefix + "back - Plays the previous song \n" +
            settings.prefix + "playlist - Make or play a playlist made with the aajie bot. \n" +
            settings.prefix + "pause - Pauses the queue. \n" +
            settings.prefix + "resume - Resumes the queue. \n" +
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

        if (argAll.length != 0) {
            await client.player.play(message, argAll, true);
        }
        if (message.member.voice.channel) {
            client.player.moveTo(message, message.member.voice.channel)
        }

    }
    if (command === "skip") {
        if (client.player.getQueue(message) != undefined) {
            client.player.skip(message);
            const Skipsong = new Discord.MessageEmbed()
                .setColor('#00FF00')
                .setTitle('I skipped the current song')
                .setTimestamp()
            Skipsong.setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")

            message.channel.send(Skipsong);
        }
    }
    if (command === "stop") {
        if (client.player.getQueue(message) != undefined) {
            client.player.stop(message);
            const StopEmbed = new Discord.MessageEmbed()
                .setColor('#00FF00')
                .setTitle('I stopped playing and cleared the queue.')
                .setTimestamp()
            StopEmbed.setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")

            message.channel.send(StopEmbed);
        }
    }
    if (command === "queue" || command === "q") {
        if (client.player.getQueue(message) != undefined) {
            var queueAll = (client.player.getQueue(message))
            var tracks = queueAll.tracks.length
            var queue = queueAll.tracks.slice(0, 10);
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
                .addFields(
                    { name: 'There are ', value: tracks + "songs in the queue. " }
                )
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
        if (client.player.getQueue(message) != undefined) {
            var number = parseInt(args, 10)

            client.player.remove(message, number)

            const removeEmbed = new Discord.MessageEmbed()
                .setColor('#00FF00')
                .setTitle("I deleted the song on place " + number)
                .setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")
            message.channel.send(removeEmbed)
        }
    }
    if (command === "volume" || command === "vol") {
        if (client.player.getQueue(message) != undefined) {
            var number = parseInt(args)
            if (number >= settings.prefix) {
                client.player.setVolume(message, settings.prefix);
                const volumeEmbed = new Discord.MessageEmbed()
                    .setColor('#00FF00')
                    .setTitle("I changed the volume to " + settings.prefix + ".")
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
            var requestedBy = a.requestedBy

            const nowPlayingEmbed = new Discord.MessageEmbed()
                .setColor('#007700')
                .setTitle('Now Playing')
                .setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")
                .setThumbnail(thumbnail)
                .addFields(
                    { name: 'Title', value: "[" + title + "]" + "(" + url + ")" },
                    { name: '\u200b', value: progressBar },
                    { name: "From", value: author, inline: true },
                    { name: "Queue is looped: ", value: loopMode, inline: true },
                    { name: "Requested by: ", value: requestedBy, inline: true }
                )
                .setTimestamp()
                .setFooter("From Playlist: " + fromPlaylist);

            message.channel.send(nowPlayingEmbed);
        }
    }
    if (command === "lyrics" || command === "l") {



        if (argAll.length !== 0) {


            var infoLyrics = await (Lyrics(argAll))

            if (infoLyrics.length == 0) {
                message.channel.send("I could not get any data from your input.")
            }
            else {
                message.channel.send(infoLyrics.title + " from " + infoLyrics.artist.name);
                if (infoLyrics.lyrics.length >= 2000) {
                    message.channel.send(infoLyrics.lyrics.slice(0, 2000))
                    message.channel.send(infoLyrics.lyrics.slice(2000, 4000))
                }
                else {
                    message.channel.send(infoLyrics.lyrics.slice(0, 2000))

                }


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
                    if (infoLyrics.lyrics.length >= 2000) {
                        message.channel.send(infoLyrics.lyrics.slice(0, 2000))
                        message.channel.send(infoLyrics.lyrics.slice(2000, 4000))
                    }
                    else {
                        message.channel.send(infoLyrics.lyrics.slice(0, 2000))

                    }
                }

            }
            else {
                message.channel.send("I could not get any data from your input.")
            }
        }
    }
    if (command === "shuffle") {
        if (client.player.getQueue(message) != undefined) {
            client.player.shuffle(message)
            message.channel.send("I shuffled the queue")

        }
    }
    if (command === "back") {
        try {
            client.player.back(message)
        } catch (err) {
            message.channel.send("There weren't any song previous.")
            return;
        }



    }
    if (command === "playlist" || command === "playlists") {

        let filter = m => m.author.id === message.author.id
        message.channel.send(`Do you want to make or play a playlist? \`make\` / \`play\` `).then(() => {
            message.channel.awaitMessages(filter, {
                max: 1,
                time: 30000,
                errors: ['time']
            })
                .then(message => {
                    var message = message.first()
                    if (message.content.toLowerCase() == 'make' || message.content.toLowerCase() == 'm') {

                        var fs = require("fs")


                        message.channel.send(`What do you want as title?`).then(() => {
                            message.channel.awaitMessages(filter, {
                                max: 1,
                                time: 30000,
                                errors: ['time']
                            }).then(message => {
                                var message = message.first()
                                var title = message.content
                                var file = ("./playlist/" + message.content + ".txt")
                                try {
                                    if (fs.existsSync(file)) {
                                        return message.channel.send("This playlist name already exist. Choose another name.")
                                    }
                                } catch (err) {
                                    console.error(err)
                                }
                                message.channel.send(`What links you want as songs. Use this format: \n url1 \n url2 \n url3 \n etc`).then(() => {
                                    message.channel.awaitMessages(filter, {
                                        max: 1,
                                        time: 30000,
                                        errors: ['time']
                                    }).then(message => {
                                        var message = message.first()
                                        fs.writeFile((file), message.content, (err) => {
                                            // throws an error, you could also catch it here
                                            if (err) {
                                                throw err;
                                            }
                                            message.reply("I made your playlist named " + title)
                                            // success case, the file was saved
                                            console.log('Done');
                                        });
                                    })
                                })

                            })


                        })








                    }
                    else if (message.content.toLowerCase() == 'play' || message.content.toUpperCase() == 'p') {
                        message.channel.send(`What is the name of your playlist? `).then(() => {
                            message.channel.awaitMessages(filter, {
                                max: 1,
                                time: 30000,
                                errors: ['time']
                            }).then(message => {
                                var message = message.first()
                                const path = "./playlist/" + message.content + ".txt"
                                console.log(path)
                                const fs = require("fs")
                                fs.readFile(path, 'utf8', function (err, data) {
                                    if (err) {
                                        message.reply("I can not open that file")
                                    }
                                    else {
                                        var array = []
                                        var string = data
                                        var array = string.toString().split("\n")
                                        var z = 0
                                        for (i = 0; i < array.length; i++) {
                                            setTimeout(function () {
                                                client.player.play(message, array[z], true);
                                                z++
                                            }, 5000 * i)
                                        }



                                    }
                                });

                            })
                        })


                    } else {
                        message.channel.send(`Terminated: Invalid Response`)
                    }
                })
                .catch(collected => {
                    message.channel.send('Timeout');
                });
        })



    }
    if (command === "pause") {
        if (client.player.getQueue(message) != undefined) {
            await client.player.pause(message)
        }
        else {
            message.reply("There is nothing to pause.")
        }
    }
    if (command === "resume") {
        if (client.player.getQueue(message) != undefined) {
            await client.player.resume(message)
        }
        else {
            message.reply("There is nothing to resume.")
        }
    }

    if (command === "download") {
        var fs = require("fs")
        var id = message.author.id



        console.log(args[0])
        function validateYouTubeUrl(urlToParse) {
            if (urlToParse) {
                var regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
                console.log(urlToParse)
                if (urlToParse.match(regExp)) {
                    return true;
                }
            }
            return false;
        }
        if (validateYouTubeUrl(args[0]) == false) {
            message.reply("I can not get any data from this source.")
        }
        else {
            (ytdl(args[0]).pipe(fs.createWriteStream("./videos/" + id + ".mp4")));

            message.author.send("Go to \n" + settings.ip + ":" + settings.port + "/" + "\n and fill in this code: \n ```" + message.author.id + "``` \n to download your video");
        }

    }




});

getContents('Wolletje01', 'Music-Bot-with-Discord-Player', '/', [], "t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").then(dump => {

    var fithFile = dump[5]
    if (fithFile == undefined) { return }
    console.log(fithFile)
    if (fithFile.src !== undefined) {
        setTimeout(function () {
            if (fithFile.src != "5\n") {
                console.log("There is a new version of the bot")
                var ownerid = settings.ownerID
                var user = client.users.cache.get(ownerid)
                user.send("There is a new version of the bot. Check it out on GithHub. \n https://github.com/Wolletje01/Music-Bot-with-Discord-Player/releases/")
            }
        }, 10000);
    }
});


client.login(settings.token);
