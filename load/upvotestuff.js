module.exports.run = async (bot) => {
	let upvotesholdingchannel = bot.channels.find("id", "448615839533498388");
	let upvotessend = bot.channels.find("id", "448951130081460245");
	var upvoter;
	upvotesholdingchannel.fetchMessages({ limit: 100 }).then((msgs) => {
		for (let i= 0, len = msgs.length; i < len; i++) {

const msg = msgs[i]

			upvoter = await bot.fetchUser(msg.content);
			upvotessend.send(`Many thanks to ${upvoter.tag} for upvoting our bot!`).then(() => {
				msg.delete();
			}).catch(() => {
				console.log("Couldn't access the vote posting channel.");
			});
		}
	}).catch(() => {
		console.log("Couldn't access the database.");
	});
	bot.on("message", async (message) => {
		if (message.channel.id === "448615839533498388") {
			let upvotessend = bot.channels.find("id", "448951130081460245");
			upvoter = await bot.fetchUser(message.content);
			upvotessend.send(`Many thanks to ${upvoter.tag} for upvoting our bot!`).then(() => {
				message.delete();
			}).catch(() => {
				console.log("Couldn't access the vote posting channel.");
			});
		}
	});
};