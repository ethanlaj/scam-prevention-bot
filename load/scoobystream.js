module.exports.run = async (bot) => {
	bot.fetchUser("291367352476631040").then(user => {
		if (!user.presence.game) return bot.user.setActivity("for !help", { type: "WATCHING" });
		if (!user.presence.game.streaming) return bot.user.setActivity("for !help", { type: "WATCHING" });
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
					bot.user.setActivity(newMember.presence.game.name, {
						type: "STREAMING",
						url: newMember.presence.game.url
					});
				} else bot.user.setActivity("for !help", { type: "WATCHING" });
			} else bot.user.setActivity("for !help", { type: "WATCHING" });
		}
	});
};