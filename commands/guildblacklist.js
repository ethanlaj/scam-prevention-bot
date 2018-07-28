const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix, permissionLevel) => {
	if (permissionLevel > 0) {
		var mod = bot.channels.find("id", "469621338089324544");
		var channel = bot.channels.find("id", "444588563032440833");
		var guildid = args[0];
		if (!guildid) return message.reply("You must supply a guild id!").catch(() => {
			return message.author.send(`You attempted to use the \`guildblacklist\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
		if (!bot.data.blacklistedGuilds.find((value) => value.id === guildid)) {
			channel.send(`${guildid}`).then((newMessage) => {
				message.react("\u2705").catch(function () { });
				bot.data.blacklistedGuilds.push({ msg: newMessage, id: guildid });
			}).catch(() => {
				return message.reply("Couldn't blacklist this guild! Please try again.").catch(() => {
					return message.author.send(`You attempted to use the \`guildblacklist\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
				});
			});
			let log = new Discord.RichEmbed()
				.setTitle("Guild Blacklisted")
				.setColor("#FF0000")
				.addField("Time Blacklisted", message.createdAt)
				.addField("Moderator", message.author)
				.addField("Guild ID", guildid);
			await mod.send(log).catch(function () { });
		} else return message.reply("This guild is already blacklisted!").catch(() => {
			return message.author.send(`You attempted to use the \`guildblacklist\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
	}
};

module.exports.help = {
	name: "guildblacklist",
	description: "Blacklists a server from using the report command",
	type: "Support"
};
