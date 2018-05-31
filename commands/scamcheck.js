const rbx = require("roblox-js");
module.exports.run = async (bot, message, args) => {
	var errortf;
	if (!args[0]) return message.reply("Please provide a roblox username to check with!").catch(() => {
		return message.author.send(`You attempted to use the \`scamcheck\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
	});
	let user = await rbx.getIdFromUsername(args[0]).catch((err) => {
		errortf = true;
		return message.reply(`${err}. If error persists, contact support by doing !server.`).catch(() => {
			return message.author.send(`You attempted to use the \`scamcheck\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
	});
	if (errortf == true) return;
	let checker = bot.data.scammers.find(value => value.id === user);
	if (checker) return message.reply(`This person is in our scammers database!\n**Link to their profile:** https://www.roblox.com/users/${user}/profile`).catch(() => {
		return message.author.send(`You attempted to use the \`scamcheck\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
	});
	if (!checker) return message.reply("This person is not in our scammers database!").catch(() => {
		return message.author.send(`You attempted to use the \`scamcheck\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
	});
};

module.exports.help = {
	name: "scamcheck",
	description: "Tells you whether the username you provided is in our scam database or not",
	type: "Public"
};
