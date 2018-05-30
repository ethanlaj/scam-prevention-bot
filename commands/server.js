
module.exports.run = async (bot, message) => {
	message.reply("**Scam Reports Support Server:** https://discord.gg/53Jgcu5").catch(() => {
		return message.author.send(`You attempted to use the \`server\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
	});
};
module.exports.help = {
	name: "server",
	description: "Sends you the invite to the support server",
	type: "Public"
};
