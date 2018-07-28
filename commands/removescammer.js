const Discord = require("discord.js");
const rbx = require("roblox-js");

module.exports.run = async (bot, message, args, prefix, permissionLevel) => {
	if (permissionLevel > 0) {
		let userid = args[0];
		let post = bot.channels.find("id", "469615976522973189");
		let msgs = await post.fetchMessages({ limit: 100 });
		if (userid) {
			var errortf;
			let user = await rbx.getIdFromUsername(args[0]).catch((err) => {
				errortf = true;
				return message.reply(`${err}. If error persists, contact support by doing !server.`).catch(() => {
					return message.author.send(`You attempted to use the \`removescammer\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
				});
			});
			if (errortf == true) return;

			if (bot.data.scammers.find((value) => value.id === user.toString())) {
				bot.data.scammers.find((value) => value.id === user.toString()).msg.delete();
				bot.data.scammers.splice(bot.data.scammers.indexOf(bot.data.scammers.find((value) => value.id === user.toString())), 1);
				var inchannel = msgs.find((m) => RegExp(user, "gi").test(m.content));
				if (inchannel) inchannel.delete();
				message.react("\u2705");
				let mod = bot.channels.find("id", "469621338089324544");
				let log = new Discord.RichEmbed()
					.setTitle("Removed Scammer")
					.setColor("#FF0000")
					.addField("Time Removed", message.createdAt)
					.addField("Moderator", message.author)
					.addField("User Removed", userid);
				await mod.send(log);
			} else return message.reply("This user is not in the scammers database!").catch(() => {
				return message.author.send(`You attempted to use the \`removescammer\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
			});

		}
	}


};

module.exports.help = {
	name: "removescammer",
	description: "Removes a scammer from the scammers database",
	type: "Support"
};
