module.exports.run = async (bot) => {
	bot.fetchUser("291367352476631040").then((user) => {
		if (!user.presence.game) return bot.auto = true;
		if (!user.presence.game.streaming) return bot.auto = true;
		bot.auto = false;
		bot.user.setActivity(user.presence.game.name, {
			type: "STREAMING",
			url: user.presence.game.url
		});
	}).catch(() => {
		console.log("Couldn't set the status for Scooby's streaming module.");
	});
	bot.on("presenceUpdate", function (oldMember, newMember) {
		if (oldMember.user.id === "291367352476631040") {
			if (newMember.presence.game !== null) {
				if (newMember.presence.game.streaming) {
					bot.auto = false;
					bot.user.setActivity(newMember.presence.game.name, {
						type: "STREAMING",
						url: newMember.presence.game.url
					});
				} else bot.auto = true;
			} else bot.auto = true;
		}
	});
};