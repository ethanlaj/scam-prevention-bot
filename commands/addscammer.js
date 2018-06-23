const { RichEmbed } = require("discord.js");
const rbx = require("roblox-js");

module.exports = {
	help: {
		name: "addscammer",
		description: "Adds a scammer to the scammers database",
		type: "Support"
	},
	run: async function(bot, message, args, _, permissionLevel) {
		if (permissionLevel > 0) {
			var scammersChannel = bot.channels.get("444588565154889738"),
				post = bot.channels.get("443959210817093642"),
				userID = args[0];
			if (userID != null) {
				var errortf = false;
				var user = await rbx.getIdFromUsername(args[0]);
				if (user != null) {
					if (bot.data.scammers.find((value) => value.id === user.toString()) != null) {
						scammersChannel.send(user.toString()).then((newmessage) => {
							bot.data.scammers.push({ msg: newmessage, id: user.toString() });
						}).catch(() => {});
						post.send(`**${userID}**, https://www.roblox.com/users/${user}/profile`).catch(() => {});
						message.react("\u2705").catch(() => {});
						var mod = bot.channels.get("444634075836448768");
						var log = new RichEmbed()
							.setTitle("Scammer Added")
							.setColor("#FF0000")
							.addField("Time Added", message.createdAt)
							.addField("Moderator", message.author)
							.addField("User Added", userID.toString());
						mod.send({ embed: log }).catch(() => {});
					} else {
						message.reply("This user is already in the scammer database!").catch(() => {
							message.author.send(`You attempted to use the \`addscammer\` command in ${message.channel}, but I can not chat there.`).catch(() => {});
						});
					}
				} else {
					message.reply("Invalid user.").catch(() => {
						message.author.send(`You attempted to use the \`addscammer\` command in ${message.channel}, but I can not chat there.`).catch(() => {});
					});
				}
			}
		}
	}
};
