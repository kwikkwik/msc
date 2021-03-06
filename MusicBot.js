const { Client, Util, RichEmbed } = require('discord.js');
const Discord = require('discord.js')
const { prefix } = require('./config.json');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const opus = require("node-opus");
const gyp = require("node-gyp");
const fs = require('fs');
const { post } = require('snekfetch');
const path = require("path");
const SQL = require("sqlite3").verbose();
const superagent = require("superagent");


const client = new Client({ disableEveryone: true });

client.util = require('./util.js')
exports.util = () =>{
return client.util
}

let {cooldown} = require("./cooldown.js")

let commandcooldown = cooldown;

let cdseconds = 5;

const cooldowns = new Discord.Collection()

const youtube = new YouTube(process.env.YT_API);

const queue = new Map();

client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => console.log(`${client.user.tag} Yo this ready!`));

client.on('disconnect', () => console.log('I just disconnected, making sure you know, I will reconnect now...'));

client.on('reconnecting', () => console.log('I am reconnecting now!'));

client.on('message', async msg => { // eslint-disable-line
	var message = msg;
	
	if (message.channel.type === 'dm') return;
	
	var DEFAULTPREFIX = '^'
	
	var {body} = await superagent
        .get("https://master-bot-social.glitch.me/prefixes")
	
	if (!body[message.guild.id]) {
        body[message.guild.id] = {
            prefixes: DEFAULTPREFIX
        };
    }
	const PREFIX = body[message.guild.id].prefixes
	
	if (msg.author.bot) return undefined;
	if (!msg.content.startsWith(PREFIX)) return undefined;
	
	if (!message.guild) return;

  if (cooldown.has(message.author.id)) {
    return;// message.reply("Please wait **`5 Seconds`** cooldown...").then(m => m.delete(5000));
  }
 // if (!message.member.hasPermission("ADMINISTRATOR")) {
    cooldown.add(message.author.id);
 // }
	    setTimeout(() => {
        commandcooldown.delete(message.author.id);
    }, 2000); //2000 ms = 2 detik\
	
	client.user.setActivity('', {type: 'STREAMING'});

	const args = msg.content.split(' ');
	
	const searchString = args.slice(1).join(' ');
	
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	
	const serverQueue = queue.get(msg.guild.id);

	let command = msg.content.toLowerCase().split(' ')[0];
	command = command.slice(PREFIX.length)
	
	
	
        if(command === 'mstats'){
const Discord = require('discord.js')
const embed = new Discord.RichEmbed()
.setColor(0x06238B)
.setAuthor(client.user.username, client.user.avatarURL)
.setDescription(`Ping: ${client.ping.toFixed(2)}ms`)
.addField(`Server Count`, `${client.guilds.size}`)
.addField(`Total Members`, `${client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`)
.addField(`Total Channels`, `${client.channels.size}`)
.addField(`Playing In`, `${queue.size} Server`)
msg.channel.send(embed)
	} else 	if (command === 'music') {
		
var option = args.slice(0).join(" ")

if (option.match('stats')) {
const Discord = require('discord.js')
const embed = new Discord.RichEmbed()
.setColor(0x06238B)
.setAuthor(client.user.username, client.user.avatarURL)
.setDescription(`Ping: ${client.ping.toFixed(2)}ms`)
.addField(`Server Count`, `${client.guilds.size}`)
.addField(`Total Members`, `${client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`)
.addField(`Total Channels`, `${client.channels.size}`)
.addField(`Playing In`, `${queue.size} Server`)
msg.channel.send(embed)
}

	} else if (command === 'evm') {
    if (msg.author.id !== '335035386923581440') return;
    try {
        let codein = args.slice(1).join(' ');
        let code = eval(codein);

        if (typeof code !== 'string')
            code = require('util').inspect(code, { depth: 0 });
        let embed = new Discord.RichEmbed()
        .setAuthor('Evaluate')
        .setColor(0x06238B)
        .addField(':inbox_tray: Input', `\`\`\`js\n${codein}\`\`\``)
        .addField(':outbox_tray: Output', `\`\`\`js\n${code}\n\`\`\``)
        msg.channel.send(embed)
    } catch(e) {
        msg.channel.send(`\`\`\`js\n${e}\n\`\`\``);
    }
} else if (command === 'search') {
        if(!searchString) return msg.channel.send({embed: { color:0x06238B,
          description: `<a:iconalert:465259242320953344> Please usage: \`${PREFIX}search <Song name | URL | Playlist URL>\``
        }})
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send({ embed: { color:0x06238B, description: 'I\'m sorry but you need to be in a voice channel to play music!'}});
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send({ embed: { color:0x06238B, description: 'I cannot connect to your voice channel, make sure I have the proper permissions!'}});
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send({ embed: { color:0x06238B, description: 'I cannot speak in this voice channel, make sure I have the proper permissions!'}});
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return msg.channel.send({ embed: { color:0x06238B, description: `<:m_cek:500912712222507008> Playlist: **${playlist.title}** has been added to the queue!`}});
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					
 var selectembed = new RichEmbed()
 .setColor(0x06238B) 
 .setTitle('Song selection')
 .setDescription(`${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}`) 
 .setFooter('Please provide a value to select one of the search results ranging from 1-10') 
 
let msgtoDelete = await msg.channel.send({ embed: selectembed})
					
					
					// eslint-disable-next-line max-depth
					try {
						const filter = msg2 => ((msg2.content > 0 && msg2.content < 11) || (/all/gi).test(msg2.content)) && msg2.author.id === msg.author.id;
					//	var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
					//		maxMatches: 1,
					//		time: 30000,
					//		errors: ['time']
					//	});
						var response = await msg.channel.awaitMessages(filter, {
						maxMatches: 1,
						time: 30000,
						errors: ['time']
					});
                                         msgtoDelete.delete();
					} catch (err) {
						console.error(err);
						const noPick = new RichEmbed()
            .setDescription("No or invalid value entered, cancelling video selection.")
            .setColor(0x06238B)
            msg.channel.send({embed: noPick});
            msgtoDelete.delete()
            return;
					}
					if((/all/gi).test(response.first().content)){
					for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
					return msg.channel.send({ embed: { color: 0x06238B, description: `<:m_cek:500912712222507008> Added 10 songs with query **${searchString}**`}});
				}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);

				} catch (err) {
					console.error(err);
					return msg.channel.send('🆘 I could not obtain any search results.');
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
	} else if (command === 'play' || command === 'p') {
	if(!args.length) return msg.channel.send(`**Please provide Song Title**`);
	try{
		const vc = msg.member.voiceChannel;
		if(!vc) return msg.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		if(!vc.permissionsFor(client.user).has(['CONNECT', 'SPEAK'])) return msg.channel.send('<a:iconalert:465259242320953344> Missing perm **CONNECT** or **SPEAK**');
		if(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/.test(args[0])){
			const playlist = await youtube.getPlaylist(args[0]);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const vid = await youtube.getVideoByID(video.id);
				await handleVideo(vid, msg, vc, true);
			}
			return msg.channel.send(`<a:music:501670339567419413> Playlist: **${playlist.title}** has been added to the queue!`);
		}
		if(/https?:\/\//gi.test(args[0])){
			const video = await youtube.getVideo(args[0]);
			return handleVideo(video, msg, vc);
		}
		const videos = await youtube.searchVideos(args.join(' '), 1);
		if(!videos.length) return msg.channel.send('🚫 | No result found');
		const video = await youtube.getVideoByID(videos[0].id);
		return handleVideo(video, msg, vc);
	} catch (err) {
		return msg.channel.send(err.stack, { code: 'ini' });
	}
		
		
	} else if (command === 'skip' || command === 's') {
		if (!msg.member.voiceChannel) return msg.channel.send({ embed: { color:0x06238B, description: 'You are not in a voice channel!'}});
		if (!serverQueue) return msg.channel.send({ embed: { color:0x06238B, description: 'There is nothing playing that I could skip for you.'}});
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		return msg.channel.send({ embed: { color: 0x06238B, description: `<a:music:501670339567419413> Skipped**`}});
	} else if (command === 'stop' || command === 'st') {
		if (!msg.member.voiceChannel) return msg.channel.send({ embed: { description: 'You are not in a voice channel!'}});
		if (!serverQueue) return msg.channel.send({ embed: { color:0x06238B, description: 'There is nothing playing that I could stop for you.'}});
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return msg.channel.send({ embed: { color: 0x06238B, description: 'The music has stopped and I has left the voice channel!'}});
	} else if (command === 'volume' || command === 'v') {

			if (!msg.member.voiceChannel) return msg.channel.send({ embed: { description: 'You are not in a voice channel!'}});
		if (!serverQueue) return msg.channel.send({ embed: { description: 'There is nothing playing.'}});
    var botRoleColorSync = msg.guild.member(client.user).highestRole.color;
		if (!args[1]) return msg.channel.send({embed: { color: 0x06238B,  description: `The current volume is: **${serverQueue.volume}**%`}});
		serverQueue.volume = args[1];
    if (args[1] > 100) return msg.channel.send({ embed: { color:0x06238B, description: `${msg.author} Volume limit is 100%, please do not hurt yourself!`}});
    serverQueue.volume = args[1];
    if (args[1] > 100) return !serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 100) +
    msg.channel.send({ embed: { color:0x06238B, description: `${msg.author} Volume limit is 100%, please do not hurt yourself!`}});
 
    if (args[1] < 101) return serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 100) + msg.channel.send({ embed: { description: `I set the volume to: __**${args[1]}**%__`}});

 
    }else if (command === 'loop' || command === 'repeat'){
		const serverQueue = queue.get(msg.member.guild.id);
		if(!serverQueue) return msg.channel.send({ embed: { color:0x06238B, description: '❌ | Im not playing anything right now'}});
		if(!msg.member.voiceChannel) return msg.channel.send({ embed: { color:3553598, description: '❌ | You must join voice channel to loop/unloop queue'}});
		serverQueue.loop = !serverQueue.loop;
		return msg.channel.send({ embed: { color:0x06238B, description: `${serverQueue.loop ? '<:m_toggleon:500582129810407425> loop on' : '<:m_toggleoff:500582170394492929> loop off' }`}});
	}else if (command === 'np' || command === 'nowplaying') {
    
    if(!serverQueue) return msg.channel.send({ embed: { color: 0x06238B, description:'There is nothing playing'}});
  const duration = (serverQueue.songs[0].duration.minutes*60000) + ((serverQueue.songs[0].duration.seconds%60000)*1000);
  const persentase = serverQueue.connection.dispatcher.time/duration;
  const curentDurationMinute = Math.floor(serverQueue.connection.dispatcher.time/60000) < 10 ? `0${Math.floor(serverQueue.connection.dispatcher.time/60000)}` : Math.floor(serverQueue.connection.dispatcher.time/60000);
  const currentDurationSeconds = Math.floor((serverQueue.connection.dispatcher.time%60000)/1000) < 10 ? `0${Math.floor((serverQueue.connection.dispatcher.time%60000)/1000)}` : Math.floor((serverQueue.connection.dispatcher.time%60000)/1000);
  const endDurationMinute = serverQueue.songs[0].duration.minutes < 10 ? `0${serverQueue.songs[0].duration.minutes}` : serverQueue.songs[0].duration.minutes;
  const endDurationSeconds = serverQueue.songs[0].duration.seconds < 10 ? `0${serverQueue.songs[0].duration.seconds}` : serverQueue.songs[0].duration.seconds;
  
  const emb = new RichEmbed()
  .setColor(0x06238B)
  .setAuthor(serverQueue.songs[0].author.tag, serverQueue.songs[0].author.avatarURL)
  .setTitle(`${serverQueue.songs[0].title}  [${serverQueue.songs[0].author}]`)
  .setURL(serverQueue.songs[0].url)
  .setThumbnail(`https://i.ytimg.com/vi/${serverQueue.songs[0].id}/default.jpg?width=80&height=60`)
  .setDescription(`▶ **${progressBar(persentase)} \`[${curentDurationMinute}:${currentDurationSeconds} - ${endDurationMinute}:${endDurationSeconds}]\`**\n`);
  
  return msg.channel.send('**`Now Playing: `**', { embed: emb});
};

function progressBar(percent){
	let num = Math.floor(percent*12);
	if(num === 1){
		return '🔵▬▬▬▬▬▬▬▬▬▬▬';
	}else if(num === 2){
		return '▬🔵▬▬▬▬▬▬▬▬▬▬';
	}else if(num === 3){
		return '▬▬🔵▬▬▬▬▬▬▬▬▬';
	}else if(num === 4){
		return '▬▬▬🔵▬▬▬▬▬▬▬▬';
	}else if(num === 5){
		return '▬▬▬▬🔵▬▬▬▬▬▬▬';
	}else if(num === 6){
		return '▬▬▬▬▬🔵▬▬▬▬▬▬';
	}else if(num === 7){
		return '▬▬▬▬▬▬🔵▬▬▬▬▬';
	}else if(num === 8){
		return '▬▬▬▬▬▬▬🔵▬▬▬▬';
	}else if(num === 9){
		return '▬▬▬▬▬▬▬▬🔵▬▬▬';
	}else if(num === 10){
		return '▬▬▬▬▬▬▬▬▬🔵▬▬';
	}else if(num === 11){
		return '▬▬▬▬▬▬▬▬▬▬🔵▬';
	}else if(num === 12){
		return '▬▬▬▬▬▬▬▬▬▬▬🔵';
	}else{
		return '🔵▬▬▬▬▬▬▬▬▬▬▬';
  } 
  
} if (command === 'queue' || command === 'q') {
		//if (!serverQueue) return msg.channel.send({ embed: { description: 'There is nothing playing.'}});
/*    let index = 0;
var queueembed = new RichEmbed() 

.setColor(3553598) 
.setTitle(`Song Queue ${serverQueue.loop ? '[loop]' : ''}`)
.setDescription(`${serverQueue.songs.map(song => `**${++index}.** [${song.title}](${song.url}) by ${song.author}`).join('\n')}`) 


return msg.channel.send(queueembed)*/
		function trimArray(arr, maxLen = 10) {
	if (arr.length > maxLen) {
		const len = arr.length - maxLen;
		arr = arr.slice(0, maxLen);
		arr.push(`${len} more...`);
	}
	return arr;
}
		try{
		//const queue = queue.get(msg.guild.id);
		if(!serverQueue) return msg.channel.send('Not playing anything right now');
  const duration = (serverQueue.songs[0].duration.minutes*60000) + ((serverQueue.songs[0].duration.seconds%60000)*1000);
  const persentase = serverQueue.connection.dispatcher.time/duration;
  const curentDurationMinute = Math.floor(serverQueue.connection.dispatcher.time/60000) < 10 ? `0${Math.floor(serverQueue.connection.dispatcher.time/60000)}` : Math.floor(serverQueue.connection.dispatcher.time/60000);
  const currentDurationSeconds = Math.floor((serverQueue.connection.dispatcher.time%60000)/1000) < 10 ? `0${Math.floor((serverQueue.connection.dispatcher.time%60000)/1000)}` : Math.floor((serverQueue.connection.dispatcher.time%60000)/1000);
  const endDurationMinute = serverQueue.songs[0].duration.minutes < 10 ? `0${serverQueue.songs[0].duration.minutes}` : serverQueue.songs[0].duration.minutes;
  const endDurationSeconds = serverQueue.songs[0].duration.seconds < 10 ? `0${serverQueue.songs[0].duration.seconds}` : serverQueue.songs[0].duration.seconds;
		const nowPlay = serverQueue.songs[0];
		const q = serverQueue.songs.slice(1);
		var queueembed = new RichEmbed()
		.setColor(0x06238B)
		.setTitle(`Song Queue`)
		.setDescription(`${trimArray(q.map(x => `[${x.title}](${x.url}) \`Requested by:\` ${x.author}`)).map((x, i) => `${i+1}. **${x}**`).join('\n')}`)
		return msg.channel.send(`
🎶** | Now playing ${serverQueue.songs[0].title}**\n${serverQueue.loop ? '| :repeat: loop' : ''}**`, {embed: queueembed});
	} catch (err) {
		return msg.channel.send(err.stack, { code: 'ini' });
	}
} else if (command === 'pause') {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send({ embed: { color:0x06238B, description: '⏸ Paused the music for you!'}});
		}
		return msg.channel.send({ embed: { color:0x06238B, description: 'There is nothing playing.'}});
	} else if (command === 'resume') {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send({ embed: { color:0x06238B, description: '▶ Resumed the music for you!'}});
		}
		return msg.channel.send({ embed: { color:0x06238B, description: 'There is nothing playing.'}});
	}

	return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	//console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`, 
		durationh: video.duration.hours,
		durationm: video.duration.minutes,
		durations: video.duration.seconds,
		duration: video.duration,   
		mamang: msg.member.voiceChannel.name, 
		meminta: msg.author,
		uploadedby: video.channel.title,
		channelurl: `https://www.youtube.com/channel/${video.channel.id}`,
	
    author: msg.author};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			loop: false,
			volume: 100,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send({ embed: { color:3553598, description: `I could not join the voice channel: ${error}`}});
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
  
var adedembed = new RichEmbed() 

  .setColor(0x06238B)
  .setAuthor(`Added to Queue`, `https://images-ext-1.discordapp.net/external/YwuJ9J-4k1AUUv7bj8OMqVQNz1XrJncu4j8q-o7Cw5M/http/icons.iconarchive.com/icons/dakirby309/simply-styled/256/YouTube-icon.png`)
  .setThumbnail(`https://i.ytimg.com/vi/${song.id}/default.jpg?width=80&height=60`)
  .addField('Title', `**[${song.title}](${song.url})**`, false)
  .addField("Video Uploader", `[${song.uploadedby}](${song.channelurl})`, true)
  .addField("Duration", `${song.durationh} Hours, ${song.durationm} Minutes, ${song.durations} Seconds`, true)
  .addField('Requested by', `${song.meminta}`)
  .setTimestamp();
		
var add = new RichEmbed() 
.setDescription(`**<:m_cek:500912712222507008> **Added To Queue [${song.title}](${song.url})**`)
.setColor(0x06238B)
		
 return msg.channel.send(add);
	}
	return undefined;
}

function play(guild, song, msg) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
		const shiffed = serverQueue.songs.shift();
		if(serverQueue.loop) serverQueue.songs.push(shiffed);
		return play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
  const endDurationHours = serverQueue.songs[0].duration.hours < 10 ? `0${serverQueue.songs[0].duration.hours}` : serverQueue.songs[0].duration.hours;
    const endDurationMinute = serverQueue.songs[0].duration.minutes < 10 ? `0${serverQueue.songs[0].duration.minutes}` : serverQueue.songs[0].duration.minutes;
  const endDurationSeconds = serverQueue.songs[0].duration.seconds < 10 ? `0${serverQueue.songs[0].duration.seconds}` : serverQueue.songs[0].duration.seconds;
var pleyembed = new RichEmbed() 

  .setColor(3553598)
  .setAuthor(`Start Playing`, `https://images-ext-1.discordapp.net/external/YwuJ9J-4k1AUUv7bj8OMqVQNz1XrJncu4j8q-o7Cw5M/http/icons.iconarchive.com/icons/dakirby309/simply-styled/256/YouTube-icon.png`)
  .setThumbnail(`https://i.ytimg.com/vi/${song.id}/default.jpg?width=80&height=60`)
  .addField('Title', `**[${song.title}](${song.url})**`, false)
  .addField("Video Uploader", `[${song.uploadedby}](${song.channelurl})`, true)
  .addField('Requested by', `${song.meminta}`, true)
  .addField('Voice Channel', `**${song.mamang}**`, true)
  .addField("Volume", `${serverQueue.volume}%`, true)
  .addField("Duration", `${song.durationh} Hours, ${song.durationm} Minutes, ${song.durations} Seconds`, true)
  .setFooter("If you can't hear the music, please reconnect. If you still can't hear maybe the bot is restarting!")
  .setTimestamp();
	
	var play = new RichEmbed() 
	.addField(`<a:music:501670339567419413> Start playing`, `[${song.title}](song.url)  \`[${endDurationHours}:${endDurationMinute}:${endDurationSeconds}]\` [${song.meminta}]`)
	.setColor(0x06238B)
	serverQueue.textChannel.send(play).then(msg => {
        msg.delete(600000)
    });

}

client.on('message', async message => {
	const superagent = require("superagent");
  
	var DEFAULTPREFIX = '^'
	
	var {body} = await superagent
        .get("https://master-bot-social.glitch.me/prefixes")
	
	if (!body[message.guild.id]) {
        body[message.guild.id] = {
            prefixes: DEFAULTPREFIX
        };
    }
	var PREFIX = body[message.guild.id].prefixes
   // let prefix = prefixes[message.guild.id].prefixes;
    let msg = message.content.toLowerCase();
    let sender = message.author;
    let args = message.content.slice(PREFIX.length).trim().split(" ");
    let cmd = args.shift().toLowerCase();
  
    if (sender.bot) return;
    if (!message.content.startsWith(PREFIX)) return;
    if (message.channel.type === 'dm') return;

    try {
        let commandFile = require(`./commands/${cmd}.js`);
        commandFile.run(client, message, args);
    } catch(e) {
        console.log(e.message);
    } finally {
        console.log(`${message.author.username} ran the command: ${cmd}`);
    }
});


client.login(process.env.BOT_TOKEN);
