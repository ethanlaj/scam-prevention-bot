const Discord = require("discord.js");
async function awaitReply(message, question, limit = 300000) {
	const filter = (m) => m.author.id === message.author.id;
	var questionembed = new Discord.RichEmbed()
		.setColor("#0000FF")
		.setDescription(question)
		.setFooter("This prompt will automatically cancel if you do not reply in 5 minutes.");
	await message.author.send(questionembed).catch(function () { });
	try {
		const collected = await message.author.dmChannel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
		return collected.first();
	} catch (error) {
		return ("Prompt cancelled, no response after five minutes");
	}
}
module.exports.run = async (bot, message) => {
	var timelimitembed = new Discord.RichEmbed()
		.setColor("#0000FF")
		.setDescription("Prompt cancelled, no response after five minutes");
	let reportchannel = bot.channels.find("id", "469621223513522216");
	let reportmessages = await reportchannel.fetchMessages({ limit: 100 });
	if (reportchannel.topic.toLowerCase() === "closed") return message.reply("🔨We are currently undergoing maintenance! We will be back soon!🔨").catch(() => {
		return message.author.send(`You attempted to use the \`report\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
	});
	if (bot.data.blacklistedUsers.find((value) => value.id === message.author.id)) return message.reply("You cannot use this command because you are blacklisted!").catch(() => {
		return message.author.send(`You attempted to use the \`report\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
	});
	if (bot.data.blacklistedGuilds.find((value) => value.id === message.guild.id)) return message.reply("You cannot use this command because this guild is blacklisted from using this command!").catch(() => {
		return message.author.send(`You attempted to use the \`report\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
	});
	if (bot.data.inPrompt.find((m) => m.id === message.author.id)) return message.reply("You are already in a prompt with the bot! Please cancel that prompt and try again.").catch(() => {
		return message.author.send(`You attempted to use the \`report\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
	});
	var cancelembed = new Discord.RichEmbed()
		.setColor("#0000FF")
		.setDescription("Prompt Cancelled");
	if (reportmessages.filter((m) => m.embeds[0] && m.embeds[0].fields && m.embeds[0].fields[5].value === message.author.id).first()) return message.reply("You cannot use this command because you already have a pending report. To prevent spam, you must wait until your report is accepted or denied. If you don't want to wait, you can cancel your report by using `!cancelreport`.").catch(() => {
		return message.author.send(`You attempted to use the \`report\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
	});
	var startingreport = new Discord.RichEmbed()
		.setColor("#0000FF")
		.setDescription("Hello! This is the report prompt! Please answer all questions to the best of your ability and remember, false reports will cause you to get blacklisted from the system!");
	await message.author.send(startingreport).catch(() => {
		return message.reply("I could not DM you the prompt! Check your privacy settings and try again!").catch(() => {
			return message.author.send(`You attempted to use the \`report\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
	});
	message.react("✅").catch(function () { });
	message.channel.send(`${message.author}, Prompt will continue in DMs! 📬`).catch(() => {
		return message.author.send(`You attempted to use the \`report\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
	});
	bot.data.inPrompt.push({ id: message.author.id });
	//----------------------------------------------------------------------------------------------------------------------------------
	var rblxname = await awaitReply(message, "What is the scammer's roblox username?\nSay **cancel** to cancel prompt.", 300000);
	if (rblxname === "Prompt cancelled, no response after five minutes") {
		await message.author.send(timelimitembed).catch(function () { });
		return bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);
	}
	if (rblxname.content && rblxname.content.toLowerCase() === "cancel") {
		bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);
		return await message.author.send(cancelembed).catch(function () { });
	}
	//----------------------------------------------------------------------------------------------------------------------------------
	let urrblxname = await awaitReply(message, "What is your roblox username?\nSay **cancel** to cancel prompt.", 300000);
	if (urrblxname.content.toLowerCase() === "cancel") {
		await bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);
		return await message.author.send(cancelembed).catch(function () { });
	}
	if (urrblxname === "Prompt cancelled, no response after five minutes") {
		await message.author.send(timelimitembed).catch(function () { });
		return bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);
	}
	//---------------------------------------------------------------------------------------------------------------------------------
	const proofembed = new Discord.RichEmbed()
		.setColor("#0000FF")
		.setFooter("This prompt will automatically cancel if you do not reply in 5 minutes.")
		.setDescription("Do you have any proof that they scammed you? Provide only images and links here.\nSay **done** to go to the next question.\nSay **cancel** to cancel prompt.");
	await message.author.send(proofembed).catch(function () { });
	const filter = (m) => m.author.id === message.author.id;
	const collector = message.author.dmChannel.createMessageCollector(filter, {
		time: 300000
	});
	var proof = await new Promise(function (resolve) {
		collector.on("collect", async function (m) {
			if (m.content.toLowerCase() === "done") {
				collector.stop();
			}
			if (m.content.toLowerCase() === "cancel") {
				bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);

				return message.author.send(cancelembed).catch(function () { });
			}
		});
		collector.on("end", async function (collected) {
			if (!collected.first()) {
				bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);

				return message.author.send(timelimitembed).catch(function () { });
			}
			if (collected.size === 1) {
				const byeembed = new Discord.RichEmbed()
					.setColor("#0000FF")
					.setDescription("You must provide at least some kind of proof! Prompt cancelled.");
				bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);

				return await message.author.send(byeembed).catch(function () { });
			}
			let aproof = collected.filter((m) => m.content.startsWith("https://") || m.content.startsWith("http://"));
			let abproof = aproof.array();
			let aaproof = collected.filter((m) => m.attachments.first());
			let bproof = aaproof.array();
			let cproof = bproof.map((m) => m.attachments.first()
				.url)
				.join("\n");
			let mproof = abproof.map((m) => m.content)
				.join("\n");
			resolve(`${cproof}\n${mproof}`);
		});
	});
	const byeembedo = new Discord.RichEmbed()
		.setColor("#0000FF")
		.setDescription("You must provide at least some kind of proof! Prompt cancelled.");
	if (proof === "\n") {
		await bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);
		return message.author.send(byeembedo).catch(function () { });
	}
	//----------------------------------------------------------------------------------------------------------------------------------
	let describe = await awaitReply(message, "How were you scammed? Explain anything we need to know here.\nSay **cancel** to cancel prompt.", 300000);
	if (describe.content && describe.content.toLowerCase() === "cancel") {
		bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);
		return await message.author.send(cancelembed).catch(function () { });
	}
	if (describe === "Prompt cancelled, no response after five minutes") {
		await message.author.send(timelimitembed).catch(function () { });
		return await bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);

	}
	//----------------------------------------------------------------------------------------------------------------------------------
	const confirm = await awaitReply(message, `**The following information will be sent:**\nScammer's Roblox Username: ${rblxname}\nYour Roblox Username: ${urrblxname}\nProof Of Scam: ${proof}\nOther Information: ${describe}\n---------------------------------------\nSay **confirm** to send the report.\nSay **cancel** to cancel the prompt.`, 300000);
	if (confirm.content && confirm.content.toLowerCase() === "cancel") {
		bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);
		return message.author.send(cancelembed).catch(function () { });
	}
	if (confirm === "Prompt cancelled, no response after five minutes") {
		await message.author.send(timelimitembed).catch(function () { });
		return await bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);

	}
	//----------------------------------------------------------------------------------------------------------------------------------
	let casechannel = bot.channels.find("id", "444588562793627668");
	let casenu = await casechannel.fetchMessage("444593973764292618");
	let casenumber = Number(`${casenu.content}`);
	await casenu.edit(`${casenumber + 1}`);
	let casenua = await casechannel.fetchMessage("444593973764292618");
	let reportEmbed = new Discord.RichEmbed()
		.setTitle("New Scam Report")
		.setColor("#FF0000")
		.addField("Case Number", casenua.content)
		.addField("Guild Reported From", message.guild.name)
		.addField("Guild ID", message.guild.id)
		.addField("Reporter", message.author)
		.addField("Reporter's Username", message.author.tag)
		.addField("Reporter's User ID", message.author.id)
		.addField("Time Reported", message.createdAt)
		.addField("Reported User", rblxname)
		.addField("Reporter's Roblox Username", urrblxname)
		.addField("Proof Of Scam", proof)
		.addField("Description", describe);
	reportchannel.send(reportEmbed).catch(function () { });
	bot.data.inPrompt.splice(bot.data.inPrompt.indexOf(bot.data.inPrompt.find((m) => m.id === message.author.id)), 1);
	var hmmtho = new Discord.RichEmbed()
		.setColor("#0000FF")
		.setDescription("✅ **Successfully Submitted! -- Your Response Was Submitted And Will Be Reviewed By Our Admins And Moderators Shortly!** ✅");
	message.author.send(hmmtho).catch(function () { });
	let mod = bot.channels.find("id", "469621338089324544");
	let areportEmbed = new Discord.RichEmbed()
		.setTitle("Copy Of Report - Logging Purposes")
		.setColor("#FF0000")
		.addField("Case Number", casenua.content)
		.addField("Guild Reported From", message.guild.name)
		.addField("Guild ID", message.guild.id)
		.addField("Reporter", message.author)
		.addField("Reporter's Username", message.author.tag)
		.addField("Reporter's User ID", message.author.id)
		.addField("Time Reported", message.createdAt)
		.addField("Reported User", rblxname)
		.addField("Reporter's Roblox Username", urrblxname)
		.addField("Proof Of Scam", proof)
		.addField("Description", describe);
	await mod.send(areportEmbed).catch(function () { });
};
module.exports.help = {
	name: "report",
	description: "Starts a prompt to report a scammer and send that prompt to the support server",
	type: "Public"
};
