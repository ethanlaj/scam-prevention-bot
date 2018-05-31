const Discord = require("discord.js");
const rbx = require("roblox-js");
module.exports.run = async (bot, message, args, prefix, permissionLevel) => {
	if (permissionLevel > 0) {
		var scammerschannel = bot.channels.find("id", "444588565154889738");
		var userid = args[0];
		var post = bot.channels.find("id", "443959210817093642");
		if (userid) {
			var errortf = false;
			var user = await rbx.getIdFromUsername(args[0]).catch((err) => {
				errortf = true;
				return message.reply(`${err}. If error persists, contact support by doing !server.`).catch(() => {
					return message.author.send(`You attempted to use the \`addscammer\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
				});
			});
			if (errortf === true) return;
			if (!bot.data.scammers.find(value => value.id === user)) {
				scammerschannel.send(`${user}`).then((newmessage) => {
					bot.data.scammers.push({ msg: newmessage, id: user.toString() });
				}).catch(function () { });
				post.send(`**${userid}**, https://www.roblox.com/users/${user}/profile`).catch(function () { });
				message.react("\u2705").catch(function () { });
				var mod = bot.channels.find("id", "444634075836448768");
				var log = new Discord.RichEmbed()
					.setTitle("Scammer Added")
					.setColor("#FF0000")
					.addField("Time Added", message.createdAt)
					.addField("Moderator", message.author)
					.addField("User Added", userid);
				await mod.send(log).catch(function () { });
			} else return message.reply("This user is already in the scammer database!").catch(() => {
				return message.author.send(`You attempted to use the \`addscammer\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
			});
		}
	}


};

module.exports.help = {
	name: "addscammer",
	description: "Adds a scammer to the scammers database",
	type: "Support"
};
