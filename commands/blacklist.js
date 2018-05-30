const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix, permissionLevel) => {
	if (permissionLevel > 0) {
		var mod = bot.channels.find("id", "444634075836448768");
		var channel = bot.channels.find("id", "444588561858035723");
		var pingeduser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
		var userid = args[0];
		var blacklistEmbed = new Discord.RichEmbed().setTitle("Blacklisted User").setColor("#FF0000");
		if (pingeduser) {
			if (!bot.data.blacklistedUsers.find(value => value.id === pingeduser.id)) {
				var pingeduserob = await bot.fetchUser(pingeduser.id);
				if (!pingeduserob) message.reply("Couldn't find this user!").catch(() => {
					return message.author.send(`You attempted to use the \`blacklist\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
				});
				channel.send(`${pingeduser.id}`).then((newMsg) => {
					bot.data.blacklistedUsers.push({ msg: newMsg, id: pingeduser.id });
				}).catch(() => {
					return message.reply("Couldn't access the database to blacklist this user. Please try again.").catch(() => {
						return message.author.send(`You attempted to use the \`blacklist\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
					});
				});
				message.react("\u2705").catch(function () { });
				blacklistEmbed = blacklistEmbed
					.addField("Time Blacklisted", message.createdAt)
					.addField("Moderator", message.author)
					.addField("Blacklisted", pingeduserob.tag)
					.addField("Blacklisted ID", pingeduserob.id);
				await mod.send({ embed: blacklistEmbed }).catch(function () { });
			} else return message.reply("This user is already blacklisted!").catch(() => {
				return message.author.send(`You attempted to use the \`blacklist\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
			});
		} else {
			if (!bot.data.blacklistedUsers.find(value => value.id === userid)) {
				var userob = await bot.fetchUser(pingeduser.id);
				if (!userob) return message.reply("Couldn't find this user!").catch(() => {
					return message.author.send(`You attempted to use the \`blacklist\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
				});
				channel.send(`${userid}`).then((newMessage) => {
					bot.data.blacklistedUsers.push({ msg: newMessage, id: userid });
				}).catch(() => {
					return message.reply("Couldn't access the database to blacklist this user. Please try again.").catch(() => {
						return message.author.send(`You attempted to use the \`blacklist\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
					});
				});
				message.react("\u2705").catch(function () { });
				blacklistEmbed = blacklistEmbed
					.addField("Time Blacklisted", message.createdAt)
					.addField("Moderator", message.author)
					.addField("User Blacklisted", userob.tag);
				await mod.send({ embed: blacklistEmbed }).catch(function () { });
			} else return message.reply("This user is already blacklisted!").catch(() => {
				return message.author.send(`You attempted to use the \`blacklist\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
			});
		}
	}
};
module.exports.help = {
	name: "blacklist",
	description: "Blacklists a user from using the report command",
	type: "Support"
};
