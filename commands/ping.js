module.exports.run = async (bot, message) => {
	message.reply(`pong! \`${Math.floor(bot.pings[0])}ms\``).catch(() => {
		return message.author.send(`You attempted to use the \`ping\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
	});
};
module.exports.help = {
	name: "ping",
	description: "Responds with the bot's ping",
	type: "Public"
};
