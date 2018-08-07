const Discord = require("discord.js");

module.exports = {
	help: {
		name: "blacklist",
		description: "Blacklists a user from using the report command",
		type: "Support"
	},
	run: async function(bot, message, args, _, permissionLevel) {
		if (permissionLevel > 0) {
			var mod = bot.channels.get("469621338089324544");
			var channel = bot.channels.get("444588561858035723");
			var pingedUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
			var userID = args[0];
			var blacklistEmbed = new Discord.RichEmbed().setTitle("Blacklisted User").setColor("#FF0000");
			if (pingedUser) {
				if (!bot.data.blacklistedUsers.find((value) => value.id === pingedUser.id)) {
					channel.send(`${pingedUser.id}`).then((newMsg) => {
						bot.data.blacklistedUsers.push({ msg: newMsg, id: pingedUser.id });
					}).catch(() => {
						return message.reply("Couldn't access the database to blacklist this user. Please try again.").catch(() => {
							return message.author.send(`You attempted to use the \`blacklist\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
						});
					});
					message.react("\u2705").catch(function () { });
					blacklistEmbed
						.addField("Time Blacklisted", message.createdAt)
						.addField("Moderator", message.author)
						.addField("Blacklisted", pingedUser.user.tag)
						.addField("Blacklisted ID", pingedUser.user.id);
					await mod.send({ embed: blacklistEmbed }).catch(function () { });
				} else return message.reply("This user is already blacklisted!").catch(() => {
					return message.author.send(`You attempted to use the \`blacklist\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
				});
			} else {
				if (!bot.data.blacklistedUsers.find((value) => value.id === userID)) {
					var userob = await bot.fetchUser(userID);
					if (!userob) return message.reply("Couldn't find this user!").catch(() => {
						return message.author.send(`You attempted to use the \`blacklist\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
					});
					channel.send(`${userID}`).then((newMessage) => {
						bot.data.blacklistedUsers.push({ msg: newMessage, id: userID });
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
	}
};
