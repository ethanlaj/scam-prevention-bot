const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix, permissionLevel) => {
	if (permissionLevel > 0) {
		let reportschannel = bot.channels.find("id", "444633860769185832");
		await reportschannel.setTopic("open").then(() => {
			message.react("✅").catch(function () { });
		}).catch(() => {
			return message.reply("Couldn't open reports. Please try again. If error persists, change the channel topic to `open` manually").catch(() => {
				return message.author.send(`You attempted to use the \`open\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
			});
		});
		let mod = bot.channels.find("id", "444634075836448768");
		let log = new Discord.RichEmbed()
			.setTitle("Reports Opened")
			.setColor("#FF0000")
			.addField("Time Set", message.createdAt)
			.addField("Moderator", message.author);
		await mod.send(log).catch(function () { });

	}
};

module.exports.help = {
	name: "open",
	description: "Opens up the report command",
	type: "Support"
};
