module.exports.run = async (bot) => {
	let dbguild = bot.guilds.get("443929284411654144");
	let channels = dbguild.channels.filter(m => RegExp("prefix-database", "gi").test(m.name));
	async function getPrefixes() {
		const nestedMessages = await Promise.all(channels.map(ch => ch.fetchMessages({ limit: 100 })));
		const flatMessages = nestedMessages.reduce((a, b) => a.concat(b));
		return flatMessages;
	}
	bot.channels.find("id", "444588561858035723").fetchMessages({ limit: 100 }).then((blacklistedusers) => {
		blacklistedusers.forEach((blacklisteduser) => {
			var userid = blacklisteduser.content;
			bot.data.blacklistedUsers.push({ msg: blacklisteduser, id: userid });
		});
	}).catch(() => {
		console.log("Couldn't access the database.");
	});
	bot.channels.find("id", "444588561858035723").fetchMessages({ limit: 100 }).then((blacklistedguilds) => {
		blacklistedguilds.forEach((blacklistedguild) => {
			var guild = blacklistedguild.content;
			bot.data.blacklistedGuilds.push({ msg: blacklistedguild, id: guild });
		});
	}).catch(() => {
		console.log("Couldn't access the database.");
	});
	bot.channels.find("id", "444588565154889738").fetchMessages({ limit: 100 }).then((scammers) => {
		scammers.forEach((scammer) => {
			bot.data.scammers.push({ msg: scammer, id: scammer.content });
		});
	}).catch(() => {
		console.log("Couldn't access the database.");
	});
	bot.channels.find("id", "444588560859791381").fetchMessages({ limit: 100 }).then((codes) => {
		codes.forEach((code) => {
			bot.data.codes.push({ msg: code, code: code.content.split(" ")[0].trim(), expires: code.content.split(" ")[1].trim() });
		});
	}).catch(() => {
		console.log("Couldn't access the database.");
	});
	bot.channels.find("id", "444588564056113162").fetchMessages({ limit: 100 }).then((pusers) => {
		pusers.forEach((puser) => {
			bot.data.pusers.push({ msg: puser, id: puser.content.split(" ")[0].trim(), expires: puser.content.split(" ")[1].trim() });
		});
	}).catch(() => {
		console.log("Couldn't access the database.");
	});
	var prefixMessages = await getPrefixes();
	prefixMessages.forEach((prefixMessage) => {
		var guild = prefixMessage.content.split(" ")[0];
		var prefix = prefixMessage.content.split(" ")[1];
		bot.data.prefixes.push({ msg: prefixMessage, guild: guild, prefix: prefix });
	});
};
