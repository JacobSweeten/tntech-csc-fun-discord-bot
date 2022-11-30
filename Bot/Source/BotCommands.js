const md5 = require("md5")

const SwearJar = require("./SwearJar");

class BotCommands
{
	static responses = [
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
		"You may rely on it."];
	
	static async okBoomer(interaction)
	{
		var msgID = interaction.options.get("messageid", true).value;

		try
		{
			var targetMsg = await interaction.channel.messages.fetch(msgID);
		}
		catch(e)
		{
			msg.reply("That is an invalid message ID or it is not in this channel.");
			return;
		}

		await interaction.deferReply({ephemeral: true});

		await targetMsg.react("🆗");
		await targetMsg.react("🅱️");
		await targetMsg.react("🇴");
		await targetMsg.react("🅾️");
		await targetMsg.react("🇲");
		await targetMsg.react("🇪");
		await targetMsg.react("🇷");

		interaction.editReply({content: "Done", ephemeral: true});
	}

	static async based(interaction)
	{
		var msgID = interaction.options.get("messageid", true).value;

		try
		{
			var targetMsg = await interaction.channel.messages.fetch(msgID);
		}
		catch(e)
		{
			msg.reply("That is an invalid message ID or it is not in this channel.");
			return;
		}

		await interaction.deferReply({ephemeral: true});

		await targetMsg.react("🅱️");
		await targetMsg.react("🇦");
		await targetMsg.react("🇸");
		await targetMsg.react("🇪");
		await targetMsg.react("🇩");

		interaction.editReply({content: "Done", ephemeral: true});
	}

	static eightBall(interaction)
	{
		var msg = interaction.options.get("question", true).value;

		var hash = md5(msg);
		var hashSlice = hash.substr(0, 2);
		var val = parseInt(hashSlice, 16) / 256;
		var resNum = Math.floor(val * this.responses.length);
		var res = this.responses[resNum];
		interaction.reply("Query: " + msg + "\n\nReply: " + res);
	}

	static swearJar(interaction)
	{
		interaction.reply("There is $" + (SwearJar.getValue() / 100).toFixed(2) + " in the swear jar.");
	}
};

module.exports=BotCommands