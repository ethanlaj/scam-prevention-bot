const Discord = require("discord.js");
module.exports.run = async (bot, message, args, prefix, permissionLevel) => {
	var commandsEmbed = new Discord.RichEmbed()
		.setTitle("Commands")
		.setColor("#0000FF");
	const TYPES = ["Public", "Premium", "Support", "Developer"],
		MAP = (command) => `\`${prefix}${command.help.name}\` - ${command.help.description}`;
	for (let i= 0, len = TYPES.length; i < len; i++) {

		const type = TYPES[i];

		if (type !== "Support" && type !== "Developer") {
			commandsEmbed.addField(type, bot.commands.filter((command) => command.help.type === type).map(MAP));
		} else if ((permissionLevel >= 2 && type === "Support") || (permissionLevel === 3 && type === "Developer")) {
			commandsEmbed.addField(type, bot.commands.filter((command) => command.help.type === type).map(MAP));
		}
	}

	message.author.send({ embed: commandsEmbed }).then(() => {
		message.react("\u2705").catch(function () {});
	}).catch(() => {
		message.reply("I could not DM you the list of commands! Please check your privacy commands and try again!").catch(function () {});
	});
};
module.exports.help = {
	name: "help",
	description: "Sends you a list of commands",
	type: "Public"
};
