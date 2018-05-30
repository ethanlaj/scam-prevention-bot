module.exports.run = async (bot, message, args, prefix, permissionLevel) => {
	if(permissionLevel === 3) {
		let status = args.join(" ");
		bot.user.setActivity(`${status}`, { type: bot.user.presence.game.type }).then(() => {
			message.react("\u2705").catch(function () { });
		}).catch(() => {
			return message.reply("Couldn't change the status. Please try again.").catch(() => {
				return message.author.send(`You attempted to use the \`setstatus\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
			});
		});

	}
};

module.exports.help = {
	name: "setstatus",
	description: "Sets the bot's status",
	type: "Developer"
};
