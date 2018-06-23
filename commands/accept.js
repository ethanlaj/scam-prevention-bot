const { RichEmbed } = require("discord.js");

module.exports = {
	help: {
		name: "accept",
		description: "Accepts a user's scam report",
		type: "Support"
	},
	run: async function(bot, message, args, _, permissionLevel) {
		if (permissionLevel > 0) {
			var casenumber = args[0];
			if (casenumber != null) {
				var reportsChannel = bot.channels.get("444633860769185832");
				var reports = await reportsChannel.fetchMessages({ limit: 100 });
				var matchingReport = reports.find((m) => m && m.embeds && m.embeds[0] && m.embeds[0].fields && m.embeds[0].fields[0].value === casenumber);
				if (matchingReport != null) {
					var userID = matchingReport.embeds[0].fields[5].value;
					var user = await bot.fetchUser(userID);
					if (user != null) {
						const acceptEmbed = new RichEmbed()
							.setColor("#0000FF")
							.setDescription(":white_check_mark: **Scam Report Accepted -- After reviewing your report, our moderators and admins have decided this is a valid scam report. This user will be added to our database shortly.** :white_check_mark:");
						message.author.send({ embed: acceptEmbed }).then(() => {
							message.react("✅").catch(() => {});
						}).catch(() => {
							message.reply("Couldn't DM this user!").catch(() => {
								return message.author.send(`You attempted to use the \`accept\` command in ${message.channel}, but I can not chat there.`).catch(() => {});
							});
						});
						var logs = bot.channels.get("444634075836448768");
						const acceptedReport = new RichEmbed()
							.setTitle("Accepted Report")
							.setColor("#FF0000")
							.addField("Time Accepted", message.createdAt)
							.addField("Moderator", message.author)
							.addField("Accepted", user.tag)
							.addField("Accepted ID", user.id);
						logs.send({ embed: acceptedReport }).catch(() => {});
						matchingReport.delete().catch(() => {});
					} else {
						message.reply("Couldn't find user!").catch(() => {
							message.author.send(`You attempted to use the \`accept\` command in ${message.channel}, but I can not chat there.`).catch(() => {});
						});
					}
				} else {
					message.reply("Please provide a correct case number!").catch(() => {
					       message.author.send(`You attempted to use the \`accept\` command in ${message.channel}, but I can not chat there.`).catch(() => {});
					});
				}
			} else {
				message.reply("Please provide a case number!").catch(() => {
				       message.author.send(`You attempted to use the \`accept\` command in ${message.channel}, but I can not chat there.`).catch(() => {});
			       });
			}
		}
	}
};
