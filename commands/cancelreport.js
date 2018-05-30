const Discord = require("discord.js");

module.exports.run = async (bot, message) => {

	let channel = bot.channels.find("id", "444633860769185832");
	var delmessage;
	await channel.fetchMessages({ limit: 100 }).then((messages) => {
		delmessage = messages.find(m => m.embeds[0] && m.embeds[0].fields && m.embeds[0].fields[5].value === message.author.id);
	});
	if (delmessage) {
		await delmessage.delete();
		message.react("\u2705");
		let mod = bot.channels.find("id", "444634075836448768");
		let log = new Discord.RichEmbed()
			.setTitle("Cancelled Report")
			.setColor("#FF0000")
			.addField("Time Cancelled", message.createdAt)
			.addField("Canceller", message.author.tag)
			.addField("Canceller ID", message.author.id);
		await mod.send(log);
	}
	if (!delmessage) {
		return message.reply("You do not have any unread reports!").catch(() => {
			return message.author.send(`You attempted to use the \`cancelreport\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
	}

};

module.exports.help = {
	name: "cancelreport",
	description: "Removes your unread scam report",
	type: "Public"
};
