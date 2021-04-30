const fs = require('fs');
const Discord = require('discord.js');
const ini = require('ini');

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

const client = new Discord.Client();

client.on("ready", () => {
	log("Discord connected.");

	client.user.setActivity("+help");
	setInterval(()=>{client.user.setActivity("+help");}, 3600000);
});

client.on("message", (msg) => {
	// Do not reply to self
	if(msg.author.id === "771905394142216202")
		return;

	if(msg.content.startsWith("+"))
	{
		var msgArr = msg.content.split(" ");
		var command = msgArr[0].substring(1);
		var arg = msgArr.splice(1).join(" ");
		
		log("Command from user \"" + msg.author.username + "\": \"" + command + "\" Argument: \"" + arg + "\"");

		switch(command)
		{
			case "help":
				msg.reply("```?okb to OK Boomer a message!\nMore commands to come!```");
				break;
			case "okb":
				okBoomer(arg, msg)
				break;
		}
	}
});

client.login(config.Discord.secret)