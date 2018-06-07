module.exports.run = async (bot, message, args, prefix, permissionLevel) => {
	if (permissionLevel !== 3) return;
	var mentioneduser = message.mentions.users.first().user;
	if (!mentioneduser) {
		var id = args[0];
		if (!id) return message.reply("Please mention a user or supply a user id!").catch(() => {
			return message.author.send(`You attempted to use the \`puser\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
		mentioneduser = await bot.fetchUser(id);
		if (!mentioneduser) return message.reply("Please mention a user or supply a valid user id!").catch(() => {
			return message.author.send(`You attempted to use the \`puser\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
	}
	let userschannel = bot.channels.find("id", "444588564056113162");
	let usercheck = bot.data.pusers.find(value => value.id === mentioneduser.id);
	if (usercheck) {
		await usercheck.msg.delete().then(() => {
			bot.data.pusers.splice(bot.data.pusers.indexOf(bot.data.pusers.find(value => value.id === mentioneduser.id)), 1);
			return message.reply("Removed this user's premium.").catch(() => {
				return message.author.send(`You attempted to use the \`puser\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
			});
		}).catch(() => {
			return message.reply("Couldn't access the database to remove this user's premium. Please try again.").catch(() => {
				return message.author.send(`You attempted to use the \`puser\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
			});
		});
	} else {
		var rawExpires = args[1];
		if (rawExpires === "0") rawExpires = 0;
		if (!args[1]) return message.reply("Please include an expiration date or 0!").catch(() => {
			return message.author.send(`You attempted to use the \`puser\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
		var addValue = Number(rawExpires) * 2678400000;
		var expires = Date.now() + addValue;
		if (rawExpires === 0) expires = 0;
		await userschannel.send(`${mentioneduser.id} ${expires.toString()}`).then((newmsg) => {
			bot.data.pusers.push({ msg: newmsg, id: mentioneduser.id, expires: expires.toString() });
			message.reply("Successfully given this user premium!").catch(() => {
				return message.author.send(`You attempted to use the \`puser\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
			});
		}).catch(() => {
			return message.reply("Couldn't access the database to give this user premium. Please try again.").catch(() => {
				return message.author.send(`You attempted to use the \`puser\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
			});
		});
	}

};
module.exports.help = {
	name: "puser",
	description: "Toggles a user's premium status",
	type: "Developer"
};
