const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
	var mod = bot.channels.find("id", "469621338089324544");
	var pingeduser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
	var userid = args[0];
	if (pingeduser) {
		if (bot.data.blacklistedUsers.find((value) => value.id === pingeduser.id)) {
			var pingeduserob = await bot.fetchUser(pingeduser.id);
			if (!pingeduserob) message.reply("Couldn't find this user!").catch(() => {
				return message.author.send(`You attempted to use the \`unblacklist\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
			});
			bot.data.blacklistedUsers.find((value) => value.id === pingeduser.id).msg.delete().then(() => {
				bot.data.blacklistedUsers.splice(bot.data.blacklistedUsers.indexOf(bot.data.blacklistedUsers.find((value) => value.id === pingeduser.id)), 1);
				message.react("\u2705").catch(function () { });
			}).catch(() => {
				return message.reply("Couldn't unblacklist this user because I couldn't access the database.").catch(() => {
					return message.author.send(`You attempted to use the \`unblacklist\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
				});
			});
			let log = new Discord.RichEmbed()
				.setTitle("Unblacklisted User")
				.setColor("#FF0000")
				.addField("Time Unblacklisted", message.createdAt)
				.addField("Moderator", message.author)
				.addField("Unblacklisted", pingeduserob.tag)
				.addField("Unblacklisted ID", pingeduserob.id);
			await mod.send(log);
		} else return message.reply("This user isn't blacklisted!").catch(() => {
			return message.author.send(`You attempted to use the \`unblacklist\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
	} else {
		if (bot.data.blacklistedUsers.find((value) => value.id === userid)) {
			var userob = await bot.fetchUser(userid);
			if (!userob) return message.reply("Couldn't find this user!").catch(() => {
				return message.author.send(`You attempted to use the \`unblacklist\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
			});
			bot.data.blacklistedUsers.find((value) => value.id === userid).msg.delete().then(() => {
				bot.data.blacklistedUsers.splice(bot.data.blacklistedUsers.indexOf(bot.data.blacklistedUsers.find((value) => value.id === pingeduser.id)), 1);
				message.react("\u2705").catch(function () { });
			}).catch(() => {
				return message.reply("Couldn't unblacklist this user because I couldn't access the database.").catch(() => {
					return message.author.send(`You attempted to use the \`unblacklist\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
				});
			});
			let log = new Discord.RichEmbed()
				.setTitle("Unblacklisted User")
				.setColor("#FF0000")
				.addField("Time Unblacklisted", message.createdAt)
				.addField("Moderator", message.author)
				.addField("User Unblacklisted", userid);
			await mod.send(log);
		} else return message.reply("This user isn't blacklisted!").catch(() => {
			return message.author.send(`You attempted to use the \`unblacklist\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
	}
};
module.exports.help = {
	name: "unblacklist",
	description: "Unblacklists a user from using the report command",
	type: "Support"
};
