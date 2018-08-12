module.exports.run = async (bot, message) => {
	message.reply("**Invite me here!:** <https://discordapp.com/api/oauth2/authorize?client_id=403769002700046340&permissions=469892311&scope=bot>").catch(() => {
		return message.author.send(`You attempted to use the \`invite\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
	});
};
module.exports.help = {
	name: "invite",
	description: "Sends you my invite",
	type: "Public"
};
