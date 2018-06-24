module.exports = {
	help: {
		name: "banscammers",
		description: "Bans all scammmers from your server",
		type: "Premium"
	},
	run: async function(bot, message) {
		if (message.member.hasPermission("BAN_MEMBERS")) {
			if (bot.data.pusers.find((value) => value.id === message.author.id) != null) {
				if (message.guild.me.hasPermission("BAN_MEMBERS")) {
					message.reply("Attempting to ban all scammers from this server (if any).");
					var scammers = await bot.channels.get("444588565154889738").fetchMessages({ limit: 100 });
					scammers = scammers.map((user) => user.content);
					var verifiedPeople = await bot.channels.get("443931376287481858").fetchMessages({ limit: 100 });
					verifiedPeople = verifiedPeople.map((user) => user.content.split(" "));
					var membersToBan = verifiedPeople.filter((user) => scammers.includes(user[1]));
					for (let member of membersToBan.array()) {
						message.guild.ban(member[0]).catch(() => {});
					}
				} else {
					message.reply("I do not have permissions to ban members in this server.").catch(() => {});
				}
			} else {
				message.reply("This is a premium only command. You are not premium.").catch(() => {
					message.author.send(`You attempted to use the \`banscammers\` command in ${message.channel}, but I can not chat there.`).catch(() => {});
				});
			}
		} else {
			message.reply("You do not have permission to use this command").catch(() => {
				message.author.send(`You attempted to use the \`banscammers\` command in ${message.channel}, but I can not chat there.`).catch(() => {});
			});
		}
	}
};
