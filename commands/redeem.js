module.exports.run = async (bot, message, args) => {
	let userschannel = bot.channels.find("id", "444588564056113162");
	if (bot.data.pusers.find((value) => value.id === message.author.id)) return message.reply("You already have premium!").catch(() => {
		return message.author.send(`You attempted to use the \`redeem\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
	});
	let code = args[0];
	if (!code) return message.reply("Please include the code to redeem!").catch(() => {
		return message.author.send(`You attempted to use the \`redeem\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
	});
	if (!bot.data.codes.find((value) => value.code === code)) return message.reply("Not a valid code!").catch(() => {
		return message.author.send(`You attempted to use the \`redeem\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
	});
	var rawExpires = Number(bot.data.codes.find((value) => value.code === code).expires);
	var addValue = rawExpires * 2678400000;
	var expires = Date.now() + addValue;
	if (rawExpires === 0) expires = 0;
	bot.data.codes.find((value) => value.code === code).msg.delete().catch(function () { });
	bot.data.codes.splice(bot.data.codes.indexOf(bot.data.codes.find((value) => value.code === code)), 1);
	await userschannel.send(`${message.author.id} ${expires.toString()}`).then((newmessage) => {
		message.reply("You now have premium!").catch(() => {
			return message.author.send(`You attempted to use the \`redeem\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
		bot.data.pusers.push({ msg: newmessage, id: message.author.id, expires: expires.toString()});
	}).catch(() => {
		message.reply("Couldn't access database to give you premium, if error persists, please contact a developer!").catch(() => {
			return message.author.send(`You attempted to use the \`redeem\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
	});

};
module.exports.help = {
	name: "redeem",
	description: "Redeems a premium code to get you premium",
	type: "Public"
};