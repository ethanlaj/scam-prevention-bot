module.exports = {
	help: {
		name: "count",
		description: "Gives you our bot's server count",
		type: "Public"
	},
	run: async (bot, message) => {
		message.reply(`${bot.guilds.size} servers!`).catch(() => {
			return message.author.send(`You attempted to use the \`count\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
		});
	}
};
