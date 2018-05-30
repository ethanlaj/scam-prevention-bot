module.exports.run = async (bot, message, args, prefix, permissionLevel) => {
	if (permissionLevel === 3) {
		if (bot.counter === false) {
			bot.user.setActivity(`${bot.guilds.size} servers`, { type: "WATCHING" }).then(() => {
				message.react("\u2705").catch(function () { });
			}).catch(() => {
				return message.reply("Couldn't set the status. Please try again.").catch(() => {
					return message.author.send(`You attempted to use the \`countstatus\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
				});
			});
			bot.counter = true;
		} else if (bot.counter === true) {
			bot.user.setActivity("for !help", { type: "WATCHING" }).then(() => {
				message.react("\u2705").catch(function () { });
			}).catch(() => {
				return message.reply("Couldn't set the status. Please try again.").catch(() => {
					return message.author.send(`You attempted to use the \`countstatus\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
				});
			});
			bot.counter = false;
		}
	}
};

module.exports.help = {
	name: "countstatus",
	description: "Sets the bot's status to the server count",
	type: "Developer"
};
