const fs = require('fs');
const {REST, Routes, Client, GatewayIntentBits} = require('discord.js');
const stringSimilarity = require('string-similarity')
const Filter = require('bad-words');

const BotCommands = require("./BotCommands");

const filter = new Filter();

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
	configFile = fs.readFileSync("./config.json", "utf-8");
}
catch(err)
{
	try
	{
		log("No config file found.");
		process.exit(1);
	}
	catch(err)
	{
		error("Unable to read config file. Please ensure I have the appropriate permissions.");
		process.exit(1);
	}
}

var config = JSON.parse(configFile);

// Initialize Swear Jar
var swearJar = 0;
try
{
	swearJar = parseInt(fs.readFileSync("./swearjar.txt"), "utf-8");
}
catch(err)
{
	fs.writeFileSync("./swearjar.txt", "0");
}

function swear()
{
	swearJar += 25;
	fs.writeFileSync("./swearjar.txt", swearJar.toString());
}

// Initialize Discord Commands
const commands = [
	{
		name: "boris",
		description: "Display Boris' commands"
	},
	{
		name: "okb",
		description: "OK Boomer a message",
		options: [
			{
				name: "messageid",
				description: "The message ID you wish to OK Boomer",
				type: 3,
				required: true
			}
		]
	},
	{
		name: "8ball",
		description: "Ask the magic 8 ball a question",
		options: [
			{
				name: "question",
				description: "Your question",
				type: 3,
				required: true
			}
		]
	},
	{
		name: "based",
		description: "React to a message with based",
		options: [
			{
				name: "messageid",
				description: "The message ID you wish to BASED",
				type: 3,
				required: true
			}
		]
	},
	{
		name: "sj",
		description: "Check the swear jar balance"
	}
]

const rest = new REST({version: "10"}).setToken(config.Discord.secret);

(async () => {
	try
	{
		await rest.put(Routes.applicationCommands(config.Discord.clientID), {body: commands});
	}
	catch(e)
	{
		error(e);
		process.exit(1);
	}
})();

// Initialize Discord Client

if(config.Discord === undefined)
{
	error("No Discord object found in config file. Exiting.");
	process.exit(1);
}

if(config.Discord.secret === undefined)
{
	error("No API secret found in config file. Exiting.");
	process.exit(1);
}

const client = new Client({intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMessageReactions
]});

client.on("ready", () => {
	log("Discord connected.");

	client.user.setActivity("+help");
	setInterval(()=>{client.user.setActivity("+help");}, 3600000);
});

client.on("interactionCreate", (interaction) => {
	if(!interaction.isChatInputCommand()) return;

	if(interaction.commandName == "8ball")
	{
		BotCommands.eightBall(interaction);
	}
});

client.on("messageCreate", msg => {
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
				msg.reply("```+okb [message id] to OK Boomer a message!\n+8ball [question] to ask the Magic 8 Ball a question!\n+sj to see how much is in the swear jar.\n+based [message id] to BASED a message!\nMore commands to come!```");
				break;
			case "okb":
				BotCommands.okBoomer(arg, msg)
				break;
			case "based":
				BotCommands.based(arg, msg)
				break;
			case "8ball":
				BotCommands.eightBall(msg);
				break;
			case "sj":
				msg.reply("There is $" + (swearJar / 100).toFixed(2) + " in the swear jar.");
		}
	}

	// Detect other triggers
	if(msg.content.toLowerCase().includes("php"))
	{
		var similarity = stringSimilarity.compareTwoStrings(msg.content.toLowerCase(), "php is a good programming language");
		if(similarity > 0.8)
			msg.reply("False");
	}

	var doCreepy = Math.floor(Math.random() * 10000) === 0;
	if(doCreepy)
	{
		msg.channel.send("I see all.");
	}

	if(filter.isProfane(msg.content))
	{
		log("User \"" + msg.author.username + "\" said a bad word! The swear jar will be updated.");
		swear();
	}
});

client.login(config.Discord.secret);