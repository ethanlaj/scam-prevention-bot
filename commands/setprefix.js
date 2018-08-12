module.exports.run = async (bot, message, args) => {
	if (!message.member.hasPermission("MANAGE_GUILD")) return message.reply("You don't have permission to use this command!").catch(() => {
		return message.author.send(`You attempted to use the \`setprefix\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
	});
	if (!args[0]) return message.reply("Please provide the new prefix!").catch(() => {
		return message.author.send(`You attempted to use the \`setprefix\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
	});
	let prefix = args[0];
	if (prefix.length > 5) return message.reply("The prefix cannot be more than 5 characters!").catch(() => {
		return message.author.send(`You attempted to use the \`setprefix\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
	});
	if (bot.data.prefixes.find((value) => value.guild === message.guild.id)) bot.data.prefixes.find((value) => value.guild === message.guild.id).msg.delete();
	bot.data.prefixes.splice(bot.data.prefixes.indexOf(bot.data.prefixes.find((value) => value.guild === message.guild.id)), 1);
	var prefixdatabase = bot.channels.find((m) => m.name === "prefix-database");
	var messages = await prefixdatabase.fetchMessages({ limit: 100 });
	let dbguild = bot.guilds.get("443929284411654144");
	if (messages.size === 100) {
		await prefixdatabase.setName("o-prefix-database").catch(() => {
			return message.reply("Couldn't access the database to change your server's prefix!").catch(() => {
				return message.author.send(`You attempted to use the \`setprefix\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
			});
		});
		await dbguild.createChannel("prefix-database").catch(() => {
			return message.reply("Couldn't access the database to change your server's prefix!").catch(() => {
				return message.author.send(`You attempted to use the \`setprefix\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
			});
		});
		let newc = dbguild.channels.find((m) => m.name === "prefix-database");
		await newc.overwritePermissions(prefixdatabase.guild.id, {READ_MESSAGES: false}).catch(() => {
			return message.reply("Couldn't access the database to change your server's prefix!").catch(() => {
				return message.author.send(`You attempted to use the \`setprefix\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
			});
		});
		await newc.setParent("444587981874135051").catch(() => {
			return message.reply("Couldn't access the database to change your server's prefix!").catch(() => {
				return message.author.send(`You attempted to use the \`setprefix\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
			});
		});
		await newc.send(`${message.guild.id} ${prefix}`).then((newMessage) => {
			bot.data.prefixes.push({ msg: newMessage, guild: message.guild.id, prefix: prefix });
			message.react("\u2705");
		}).catch(() => {
			return message.reply("Couldn't access the database to change your server's prefix!").catch(() => {
				return message.author.send(`You attempted to use the \`setprefix\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
			});
		});
	} else {
		prefixdatabase.send(`${message.guild.id} ${prefix}`).then((newMessageTwo) => {
			bot.data.prefixes.push({ msg: newMessageTwo, guild: message.guild.id, prefix: prefix });
			message.react("\u2705");
		}).catch(() => {
			return message.reply("Couldn't access the database to change your server's prefix!").catch(() => {
				return message.author.send(`You attempted to use the \`setprefix\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
			});
		});
	}
};

module.exports.help = {
	name: "setprefix",
	description: "Changes my prefix in your server",
	type: "Public"
};
