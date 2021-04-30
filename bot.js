const fs = require('fs');
const Discord = require('discord.js');
const ini = require('ini');
const stringSimilarity = require('string-similarity')
const md5 = require('md5');

// Initialize logging
if(!fs.existsSync("./logs"))
{
	fs.mkdirSync("logs");
}

var logNum = 1
while(fs.existsSync("./logs/log" + logNum)) {logNum++;}

function log(message, level = "INFO")
{
	entry = "";
	dateString = new Date().toISOString()
	dateString = dateString.replace(/T/, " ");
	dateString = dateString.split(".")[0];
	entry = "[" + dateString + "]" + " " + level + "\t" + message + "\n";
	console.log(entry.substring(0, entry.length - 1));
	try
	{
		fs.appendFileSync("logs/log" + logNum, entry);
	}
	catch(err)
	{
		console.error("Unable to write log. Please ensure I have the appropriate permissions.");
		process.exit(1);
	}
}

function warn(message)
{
	log(message, "WARN");
}

function error(message)
{
	log(message, "ERROR");
}

// Initialize configs
var configFile;

try
{
	configFile = fs.readFileSync("./config.ini", "utf-8");
}
catch(err)
{
	try
	{
		fs.writeFileSync("./config.ini", "[Discord]\nsecret=SECRET HERE");
		log("No config file found. Created blank config file for you. Please modify the config file and restart.");
		process.exit(1);
	}
	catch(err)
	{
		error("Unable to read or write config file. Please ensure I have the appropriat permissions.");
		process.exit(1);
	}
}

var config = ini.parse(configFile);

// Initialize Discord

if(config.Discord === undefined)
{
	error("No [Discord] header found in config file. Exiting.");
	process.exit(1);
}

if(config.Discord.secret === undefined)
{
	error("No API secret found in config file. Exiting.");
	process.exit(1);
}

async function okBoomer(msgID, msg)
{
	var targetMsg = await msg.channel.messages.fetch(msgID);
	if(targetMsg === undefined)
	{
		msg.reply("That is an invalid message ID or it is not in this channel.");
	}

	await targetMsg.react("🆗");
	await targetMsg.react("🅱️");
	await targetMsg.react("🇴");
	await targetMsg.react("🅾️");
	await targetMsg.react("🇲");
	await targetMsg.react("🇪");
	await targetMsg.react("🇷");

}

function eightBall(msg)
{
	var responses = [
		"As I see it, yes.",
		"Ask again later.",
		"Better not tell you now.",
		"Cannot predict now.",
		"Concentrate and ask again.",
		"Don’t count on it.",
		"It is certain.",
		"It is decidedly so.",
		"Most likely.",
		"My reply is no.",
		"My sources say no.",
		"Outlook not so good.",
		"Outlook good.",
		"Reply hazy, try again.",
		"Signs point to yes.",
		"Very doubtful.",
		"Without a doubt.",
		"Yes.",
		"Yes – definitely.",
		"You may rely on it."]

		var hash = md5(msg.content);
		var hashSlice = hash.substr(0, 2);
		var val = parseInt(hashSlice, 16) / 256;
		var resNum = Math.floor(val * responses.length);
		var res = responses[resNum];
		msg.reply(res);
}

const client = new Discord.Client();

client.on("ready", () => {
	log("Discord connected.");

	client.user.setActivity("+help");
	setInterval(()=>{client.user.setActivity("+help");}, 3600000);
});

client.on("message", (msg) => {
	// Do not reply to self
	if(msg.author.id === client.user.id)
		return;

	// Parse commands
	if(msg.content.startsWith("+"))
	{
		var msgArr = msg.content.split(" ");
		var command = msgArr[0].substring(1);
		var arg = msgArr.splice(1).join(" ");
		
		log("Command from user \"" + msg.author.username + "\": \"" + command + "\" Argument: \"" + arg + "\"");

		switch(command)
		{
			case "help":
				msg.reply("```+okb to OK Boomer a message!\nMore commands to come!```");
				break;
			case "okb":
				okBoomer(arg, msg)
				break;
			case "8ball":
				eightBall(msg);
				break;
		}
	}

	// Detect other triggers
	var similarity = stringSimilarity.compareTwoStrings(msg.content, "PHP is a good programming language");
	if(similarity > 0.8)
		msg.reply("False");
});

client.login(config.Discord.secret)