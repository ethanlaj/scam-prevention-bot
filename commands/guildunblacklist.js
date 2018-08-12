const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix, permissionLevel) => {
	if (permissionLevel > 0) {
		var mod = bot.channels.get("469621338089324544");
		var guildid = args[0];
		if (!guildid) return message.reply("You must supply a guild id!").catch(() => {
			return message.author.send(`You attempted to use the \`guildunblacklist\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
		if (bot.data.blacklistedGuilds.find((value) => value.id === guildid)) {
			bot.data.blacklistedGuilds.find((value) => value.id === guildid).msg.delete().then(() => {
				message.react("\u2705").catch(function () { });
			}).catch(() => {
				return message.reply("Couldn't unblacklist this guild! Please try again.").catch(() => {
					return message.author.send(`You attempted to use the \`guildunblacklist\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
				});
			});
			bot.data.blacklistedGuilds.splice(bot.data.blacklistedGuilds.indexOf(bot.data.blacklistedGuilds.find((value) => value.id === guildid)), 1);
			let log = new Discord.RichEmbed()
				.setTitle("Unblacklisted Guild")
				.setColor("#FF0000")
				.addField("Time Unblacklisted", message.createdAt)
				.addField("Moderator", message.author)
				.addField("Guild ID", guildid);
			await mod.send(log).catch(function () { });
		} else return message.reply("This guild isn't blacklisted!").catch(() => {
			return message.author.send(`You attempted to use the \`guildunblacklist\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
	}
};

module.exports.help = {
	name: "guildunblacklist",
	description: "Unblacklists a server from using the report command",
	type: "Support"
};
