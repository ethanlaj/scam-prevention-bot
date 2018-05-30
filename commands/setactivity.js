module.exports.run = async (bot, message, args, prefix, permissionLevel) => {
	if(permissionLevel === 3) {
		let activity = args.join(" ").toUpperCase();
		bot.user.setActivity(`${bot.user.presence.game.name}`, { type: `${activity}` }).then(() => {
			message.react("\u2705").catch(function () { });
		}).catch(() => {
			return message.reply("Couldn't change the activity. Please try again.").catch(() => {
				return message.author.send(`You attempted to use the \`setactivity\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
			});
		});

	}
};

module.exports.help = {
	name: "setactivity",
	description: "Sets the bot's activity",
	type: "Support"
};
