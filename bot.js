const Discord = require("discord.js"),
    client = new Discord.Client(),
    settings = {
        prefix: "?!",
        token: "BOT TOKEN"
    };

const { Player } = require("discord-player");
// Create a new Player (you don't need any API Key)
const player = new Player(client);
// To easily access the player
client.player = player;
// add the trackStart event so when a song will be played this message will be sent
var test;
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
            message.channel.send('There is no music being played on this server!')
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
    
    // !play Despacito
    // will play "Despacito" in the member voice channel

    if (command === "play") {
      
        var args1 = args.join(" ");
        client.player.play(message, args1, true);
        setTimeout(() => {

            var lastMessage = (client.player.getQueue(message)).tracks
            var length = lastMessage.length - 1
            
                var title = lastMessage[length].title
               
                const playEmbed = new Discord.MessageEmbed()
                    .setColor('#00FF00')
                .setTitle('Added')
                    .setTimestamp()
                playEmbed.setDescription(title + "\n to the queue.");
                playEmbed.setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")

                message.channel.send(playEmbed);
            
            
        }, 2500);
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
    if (command === "queue") {

        
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
    if (command === "remove") {
        var number = parseInt(args)
        
        client.player.remove(message, number)

        const removeEmbed = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setTitle("I deleted number" + number)
        removeEmbed.setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")
    }
    if (command === "volume") {
        var number = parseInt(args)
        client.player.setVolume(message, number);
        const volumeEmbed =  new Discord.MessageEmbed()
                .setColor('#00FF00')
            .setTitle("I changed the volume to " + number)
            .setTimestamp()
           volumeEmbed.setFooter('Wolletje01#9999', "https://cdn.discordapp.com/avatars/372063501755088896/18017741014bb02a979030e2387cb7c0.png")
        message.channel.send(volumeEmbed);
    }  
    if (command === "loop") {

        
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
    if (command === "nowplaying" || command === "np") {

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
});

client.login(settings.token);