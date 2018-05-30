const Discord = require("discord.js");
module.exports.run = async (bot, message, args, prefix, permissionLevel) => {
	if (permissionLevel > 0) {
		let casenumber = args[0];
		if (!casenumber) return message.reply("Please provide a case number!").catch(() => {
			return message.author.send(`You attempted to use the \`accept\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
		let reportschannel = bot.channels.find("id", "444633860769185832");
		let reports = await reportschannel.fetchMessages({ limit: 100 });
		let matchingreport = reports.find(m => m && m.embeds && m.embeds[0] && m.embeds[0].fields && m.embeds[0].fields[0].value === casenumber);
		if (!matchingreport) return message.reply("Please provide a correct case number!");
		let userid = matchingreport.embeds[0].fields[5].value;
		let user = await bot.fetchUser(userid);
		if (!user) return message.reply("Couldn't find user!").catch(() => {
			return message.author.send(`You attempted to use the \`accept\` command in ${message.channel}, but I can not chat there.`).catch(() => {
				return message.author.send(`You attempted to use the \`accept\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
			});
		});
		var acceptembed = new Discord.RichEmbed()
			.setColor("#0000FF")
			.setDescription(":white_check_mark: **Scam Report Accepted -- After reviewing your report, our moderators and admins have decided this is a valid scam report. This user will be added to our database shortly.** :white_check_mark:");
		message.author.send(acceptembed).then(() => {
			message.react("✅").catch(function () { });
		}).catch(() => {
			message.reply("Couldn't DM this user!").catch(() => {
				return message.author.send(`You attempted to use the \`accept\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
			});
		});
		let logs = bot.channels.find("id", "444634075836448768");
		const acceptedReport = new Discord.RichEmbed()
			.setTitle("Accepted Report")
			.setColor("#FF0000")
			.addField("Time Accepted", message.createdAt)
			.addField("Moderator", message.author)
			.addField("Accepted", user.tag)
			.addField("Accepted ID", user.id);
		await logs.send({ embed: acceptedReport }).catch(function () { });
		if (matchingreport) matchingreport.delete().catch(function () { });
	}
};
module.exports.help = {
	name: "accept",
	description: "Accepts a user's scam report",
	type: "Support"
};
