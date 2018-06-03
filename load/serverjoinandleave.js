const Discord = require("discord.js");
//const DBL = require("dblapi.js");
//const request = require("request-promise-native");
/*function postServerCount() {
	return request.post({
		uri: `https://discordbots.org/api/bots/${bot.user.id}/stats`,
		headers: {
			Authorization: process.env.dbl,
		},
		json: true,
		body: {
			server_count: bot.guilds.size,
		},
	});
}*/
module.exports.run = async (bot) => {
	//postServerCount()
	bot.on("guildCreate", async guild => {
		//postServerCount()
		let welcomeMessage = new Discord.RichEmbed().setTitle("Thanks For Adding Me To Your Server!").setColor("#0000ff").setDescription("Thanks for inviting Scam reports bot to your server!\nScam reports bot is owned by Scooby and ethan and was made by the Co-Owner, @ethanlaj#8805. For a list of commands, just say `!help`\nIf you need any help what so ever, feel free to join our support server!\nInvite link: https://discord.gg/53Jgcu5");
		let hichannel = guild.channels.filter(c => c.type === "text" && c.permissionsFor(bot.user).has("READ_MESSAGES") && c.permissionsFor(bot.user).has("SEND_MESSAGES")).first();
		if (hichannel) hichannel.send(welcomeMessage);
	});
	bot.on("guildDelete", async () => {
		//postServerCount()
	});
};