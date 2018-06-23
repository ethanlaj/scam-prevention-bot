module.exports.run = async (bot) => {
	let dbguild = bot.guilds.get("443929284411654144");
	let channels = dbguild.channels.filter((m) => RegExp("prefix-database", "gi").test(m.name));
	async function getPrefixes() {
		const nestedMessages = await Promise.all(channels.map((ch) => ch.fetchMessages({ limit: 100 })));
		const flatMessages = nestedMessages.reduce((a, b) => a.concat(b));
		return flatMessages;
	}
	bot.channels.find("id", "444588561858035723").fetchMessages({ limit: 100 }).then((blacklistedusers) => {
		for (let i= 0, len = blacklistedusers.length; i < len; i++) {

			const blacklisteduser = blacklistedusers[i];

			var userid = blacklisteduser.content;
			bot.data.blacklistedUsers.push({ msg: blacklisteduser, id: userid });
		}
	}).catch(() => {
		console.log("Couldn't access the database.");
	});
	bot.channels.find("id", "444588561858035723").fetchMessages({ limit: 100 }).then((blacklistedguilds) => {
		for (let i= 0, len = blacklistedguilds.length; i < len; i++) {

			const blacklistedguild = blacklistedguilds[i];

			var guild = blacklistedguild.content;
			bot.data.blacklistedGuilds.push({ msg: blacklistedguild, id: guild });
		}
	}).catch(() => {
		console.log("Couldn't access the database.");
	});
	bot.channels.find("id", "444588565154889738").fetchMessages({ limit: 100 }).then((scammers) => {
		for (let i= 0, len = scammers.length; i < len; i++) {

			const scammer = scammers[i];

			bot.data.scammers.push({ msg: scammer, id: scammer.content });
		}
	}).catch(() => {
		console.log("Couldn't access the database.");
	});
	bot.channels.find("id", "444588560859791381").fetchMessages({ limit: 100 }).then((codes) => {
		for (let i= 0, len = codes.length; i < len; i++) {

			const code = codes[i];

			bot.data.codes.push({ msg: code, code: code.content.split(" ")[0].trim(), expires: code.content.split(" ")[1].trim() });
		}
	}).catch(() => {
		console.log("Couldn't access the database.");
	});
	bot.channels.find("id", "444588564056113162").fetchMessages({ limit: 100 }).then((pusers) => {
		for (let i= 0, len = pusers.length; i < len; i++) {

			const puser = pusers[i];

			bot.data.pusers.push({ msg: puser, id: puser.content.split(" ")[0].trim(), expires: puser.content.split(" ")[1].trim() });
		}
	}).catch(() => {
		console.log("Couldn't access the database.");
	});
	var prefixMessages = await getPrefixes();
	for (let i= 0, len = prefixMessages.length; i < len; i++) {

		const prefixMessage = prefixMessages[i];

		var guild = prefixMessage.content.split(" ")[0];
		var prefix = prefixMessage.content.split(" ")[1];
		bot.data.prefixes.push({ msg: prefixMessage, guild: guild, prefix: prefix });
	}
};
