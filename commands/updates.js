const Discord = require("discord.js");
module.exports.run = async (bot, message) => {
	let channel = bot.channels.get("444588564328742926");
	let editor = await channel.fetchMessage("444593973756166155").catch(function () { });
	let thing = new Discord.RichEmbed()
		.setTitle("Updates")
		.setColor("#FF0000")
		.setDescription(editor.content)
		.setFooter(`Requested by ${message.author.tag}`);
	await message.channel.send(thing).catch(() => {
		return message.author.send(`You attempted to use the \`updates\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
	});
};



module.exports.help = {
	name: "updates",
	description: "Gives you our latest updates to the bot",
	type: "Public"
};
