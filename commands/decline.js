const Discord = require("discord.js");

module.exports = {
	help: {
		name: "decline",
		description: "Declines a user's scam report",
		type: "Support"
	},
	run: async (bot, message, args, prefix, permissionLevel) => {
		if (permissionLevel > 0) {
			let casenumber = args[0];
			if (!casenumber) return message.reply("Please provide a case number!").catch(() => {
				return message.author.send(`You attempted to use the \`decline\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
			});
			let reportschannel = bot.channels.find("id", "469621223513522216");
			var delmessage;
			await reportschannel.fetchMessages({ limit: 100 }).then((reports) => {
				delmessage = reports.find((m) => m.embeds && m.embeds[0] && m.embeds[0].fields && m.embeds[0].fields[0].value === casenumber);
			});
			if (!delmessage) return message.reply("Please provide a correct case number!").catch(() => {
				return message.author.send(`You attempted to use the \`decline\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
			});
			let userid = delmessage.embeds[0].fields[5].value;
			let user = await bot.fetchUser(userid);
			if (!user) return message.reply("Couldn't find user!").catch(() => {
				return message.author.send(`You attempted to use the \`decline\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
			});
			let reason = message.content.substr(8 + prefix.length + args[0].length);
			var prompt = (`:x: **Scam Report Declined -- After reviewing your report, our staff members have decided this is not a valid scam report. Here is the reason your bot was declined: ${reason}** :x:`);
			if (!reason) prompt = (":x: **Scam Report Declined -- After reviewing your report, our moderators and admins have decided this is not a valid scam report. This might have been declined due to lack of evidence or lack of information in general. As a result, this user will not be added to our database.** :x:");
			if (!reason) reason = "No reason provided.";
			let declineprompt = new Discord.RichEmbed()
				.setColor("#0000FF")
				.setDescription(prompt);
			await user.send(declineprompt).then(() => {
				message.react("✅").catch(function() {});
			}).catch(() => {
				message.reply("Couldn't DM this user!").catch(() => {
					return message.author.send(`You attempted to use the \`decline\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
				});
			});
			let mod = bot.channels.find("id", "469621338089324544");
			let log = new Discord.RichEmbed()
				.setTitle("Declined Report")
				.setColor("#FF0000")
				.addField("Time Declined", message.createdAt)
				.addField("Moderator", message.author)
				.addField("Declined", user.tag)
				.addField("Declined ID", user.id)
				.addField("Reason", reason);
			await mod.send(log).catch(function() {});
			if (delmessage) await delmessage.delete().catch(function() {});
		}
	}
};
