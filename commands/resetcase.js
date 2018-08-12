module.exports.run = async (bot, message, args, prefix, permissionLevel) => {
	if (permissionLevel !== 2) return;
	let casechannel = bot.channels.get("444588562793627668");
	casechannel.fetchMessage("444593973764292618").then((casenu) => {
		casenu.edit("1").then(() => {
			message.react("✅").catch(function () { });
		}).catch(() => {
			return message.reply("Couldn't access the database to reset the case number!").catch(() => {
				return message.author.send(`You attempted to use the \`resetcase\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
			});
		});
	}).catch(() => {
		message.reply("Couldn't reach the database to reset the case number").catch(() => {
			return message.author.send(`You attempted to use the \`resetcase\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
	});
};

module.exports.help = {
	name: "resetcase",
	description: "Resets case numbers for the report command",
	type: "Owners"
};
