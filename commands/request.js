async function awaitReply(message, question, limit = 300000) {
	const filter = (m) => m.author.id === message.author.id;
	var questionembed = new Discord.RichEmbed()
		.setColor("#0000FF")
		.setDescription(question)
		.setFooter("This prompt will automatically cancel if you do not reply in 5 minutes.");
	await message.author.send(questionembed);
	try {
		const collected = await message.author.dmChannel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
		if (collected.first().content.toLowerCase() === "cancel") {
			return ("cancel");
		} else {
			return collected.first();
		}
	} catch (error) {
		return ("**Prompt cancelled, no response after five minutes.**");
	}
}

const Discord = require("discord.js");
module.exports.run = async (bot, message, args, prefix) => {
	var timelimitembed = new Discord.RichEmbed()
		.setColor("#0000FF")
		.setDescription("Prompt cancelled, no response after five minutes");
	var cancelembed = new Discord.RichEmbed()
		.setColor("#0000FF")
		.setDescription("Prompt Cancelled");
	if (!bot.data.pusers.find((value) => value.id === message.author.id)) return message.reply(`You must be a premium user to use this command! For more information, run \`${prefix}buypremium\`.`).catch(() => {
		return message.author.send(`You attempted to use the \`request\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
	});
	if (bot.data.inPrompt.find((value) => value.id === message.author.id)) return message.reply("You are in a prompt somewhere else! Please cancel that prompt and try again").catch(() => {
		return message.author.send(`You attempted to use the \`request\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
	});
	var helloembed = new Discord.RichEmbed()
		.setColor("#0000FF")
		.setDescription("Hello! This is the request prompt! Abusing this will cause you to get your premium removed without a refund.");
	await message.author.send(helloembed).catch(async () => {
		bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);
		return message.reply("I could not DM you the prompt! Check your privacy settings and try again!").catch(() => {
			return message.author.send(`You attempted to use the \`request\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
	});
	message.react("✅").catch(function () { });
	message.channel.send(`${message.author}, Prompt will continue in DMs! 📬`).catch(() => {
		return message.author.send(`You attempted to use the \`request\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
	});
	bot.data.inPrompt.push({ id: message.author.id });
	//---------------------------------------------------------------------------------------------------------------------------------
	let rblxname = await awaitReply(message, "What is your roblox username?\nSay **cancel** to cancel prompt.", 300000);
	if (rblxname === "**Prompt cancelled, no response after five minutes.**") {
		bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);
		return message.author.send(timelimitembed);
	}
	if (rblxname === "cancel") {
		bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);
		return await message.author.send(cancelembed);
	}
	//---------------------------------------------------------------------------------------------------------------------------------
	let type = await awaitReply(message, "What type of request is this? Ex: Build\nSay **cancel** to cancel prompt.", 300000);
	if (type === "**Prompt cancelled, no response after five minutes.**") {
		bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);
		return message.author.send(timelimitembed);
	}
	if (type === "cancel") {
		bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);
		return await message.author.send(cancelembed);
	}
	//---------------------------------------------------------------------------------------------------------------------------------
	let desc = await awaitReply(message, "Please give a detailed description of what you want.\nSay **cancel** to cancel prompt.", 300000);
	if (desc === "**Prompt cancelled, no response after five minutes.**") {
		bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);
		return message.author.send(timelimitembed);
	}
	if (desc === "cancel") {
		bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);
		return await message.author.send(cancelembed);
	}
	//---------------------------------------------------------------------------------------------------------------------------------
	let contact = await awaitReply(message, "How should people contact you?\nSay **cancel** to cancel prompt.", 300000);
	if (contact === "**Prompt cancelled, no response after five minutes.**") {
		bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);
		return message.author.send(timelimitembed);

	}
	if (contact === "cancel") {
		bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);
		return await message.author.send(cancelembed);
	}
	//---------------------------------------------------------------------------------------------------------------------------------
	let confirm = await awaitReply(message, `**The following information will be sent:**\nRoblox Username: ${rblxname}\nType of Request: ${type}\nDescription of Request: ${desc}\nContact Information: ${contact}\n---------------------------------------\nSay **confirm** to send the request.\nSay **cancel** to cancel the prompt.`, 300000);
	if (confirm === "**Prompt cancelled, no response after five minutes.**") {
		bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);
		return message.author.send(timelimitembed);

	}
	if (confirm === "cancel") {
		bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);
		return await message.author.send(cancelembed);
	}
	//---------------------------------------------------------------------------------------------------------------------------------
	let premiumrequests = bot.channels.find((c) => c.id === "434126927406825474");
	let reportEmbed = new Discord.RichEmbed()
		.setTitle("New Request")
		.setColor("#FF0000")
		.addField("Requester's Discord ID", message.author.id)
		.addField("Requester's Username", rblxname)
		.addField("Type Of Request", type)
		.addField("Description", desc)
		.addField("How To Contact", contact);
	await premiumrequests.send(reportEmbed);
	bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);
	var bye = new Discord.RichEmbed()
		.setColor("#0000FF")
		.setDescription("Your request was sent!");
	await message.author.send(bye).catch(function () { });
};


module.exports.help = {
	name: "request",
	description: "Requests something to be developed for you",
	type: "Premium"
};
