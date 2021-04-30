const fs = require('fs');
const Discord = require('discord.js');
const ini = require('ini');

// Initialize logging
var logNum = 1
while(fs.existsSync("./logs/log" + logNum)) {logNum++;}

function log(message, level = "INFO")
{
	entry = "";
	dateString = new Date().toISOString()
	dateString = dateString.replace(/T/, " ");
	dateString = dateString.split(".")[0];
	entry = "[" + dateString + "]" + " " + level + "\t" + message + "\n";
	console.log(entry)
	try
	{
		fs.appendFileSync("logs/log" + logNum, entry);
	}
	catch(err)
	{
		console.error("Unable to write log. Please ensure I have the appropriate permissions.");
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
		console.log("No config file found. Created blank config file for you. Please modify the config file and restart.");
		process.exit(1);
	}
	catch(err)
	{
		console.error("Unable to read or write config file. Please ensure I have the appropriat permissions.");
		process.exit(1);
	}
}

var config = ini.parse(configFile);

if(config.Discord === undefined)
{
	console.error("No [Discord] header found in config file. Exiting.");
	process.exit(1);
}

if(config.Discord.secret === undefined)
{
	console.error("No API secret found in config file. Exiting.");
	process.exit(1);
}


// Initialize Discord
const client = new Discord.Client();

client.on("ready", () => {
	console.log("Hello!");
});

client.login(config.Discord.secret)