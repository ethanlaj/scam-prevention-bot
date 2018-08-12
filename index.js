const botconfig = require("./botconfig.js");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({ disableEveryone: true, fetchAllMembers: true });
bot.loaders = { enabledLoaders: [], disabledLoaders: [] };
bot.data = { prefixes: [], inPrompt: [], blacklistedUsers: [], blacklistedGuilds: [], scammers: [], codes: [], pusers: [], timeout: [] };
bot.auto = false;
bot.commands = new Discord.Collection();
bot.disabledCommands = [];
bot.defaultPrefix = botconfig.prefix;

let files = fs.readdirSync(__dirname + "/load");
for (let file of files) {
	try {
		let loader = require("./load/" + file);
		bot.loaders.enabledLoaders.push(loader);
	} catch (err) {
		bot.loaders.disabledLoaders.push(file);
		console.log(`\nThe ${file} load module failed to load:`);
		console.log(err);
	}
}

function checkCommand(command, name) {
	var resultOfCheck = [true, null];
	if (!command.run) resultOfCheck[0] = false; resultOfCheck[1] = `Missing Function: "module.run" of ${name}.`;
	if (!command.help) resultOfCheck[0] = false; resultOfCheck[1] = `Missing Object: "module.help" of ${name}.`;
	if (command.help && !command.help.name) resultOfCheck[0] = false; resultOfCheck[1] = `Missing String: "module.help.name" of ${name}.`;
	return resultOfCheck;
}

var jsfiles;

fs.readdir("./commands/", (err, files) => {
	if (err) console.log(err);
	jsfiles = files.filter((f) => f.endsWith(".js"));
	if (jsfiles.length <= 0) return console.log("Couldn't find commands.");
	for (let f of jsfiles) {
		try {
			var props = require(`./commands/${f}`);
			if (checkCommand(props, f)[0]) {
				bot.commands.set(props.help.name, props);
			} else {
				throw checkCommand(props, f)[1];
			}
		} catch (err) {
			bot.disabledCommands.push(f);
			console.log(`\nThe ${f} command failed to load:`);
			console.log(err);
		}
	}
});
bot.on("ready", () => {
	let loaders = bot.loaders.enabledLoaders;
	for (let loader of loaders) {
		if (loader.run != null)
			loader.run(bot);
	}
	console.log(`${bot.user.tag} is online. ` +
		`${bot.commands.size}/${bot.commands.size + bot.disabledCommands.length}` +
		" commands loaded successfully.");
});

bot.on("message", async (message) => {
	if (!message.author.bot && message.channel.type !== "dm") {
		var args = message.content.split(" ");
		var rawPrefix = bot.data.prefixes.find((value) => value.guild === message.guild.id);
		var prefix = (rawPrefix != null) ? rawPrefix.prefix : bot.defaultPrefix;

		if (bot.data.pusers.find((value) => value.id === message.author.id) && bot.data.pusers.find((value) => value.id === message.author.id).expires !== "0" && bot.data.pusers.find((value) => value.id === message.author.id).expires < Date.now()) {
			bot.data.pusers.find((value) => value.id === message.author.id).msg.delete();
			bot.data.pusers.splice(bot.data.pusers.indexOf(bot.data.pusers.find((value) => value.id === message.author.id)), 1);
			message.author.send("Your premium has expired!").catch(function () { });
		}
		let guild = bot.guilds.get("400508946709872660");
		var permissionLevel = 0;
		if (guild.members.get(message.author.id)) {
			var member = await guild.fetchMember(message.author.id);
			if (member.roles) {
				if (member.roles.get("469588873090170880")) permissionLevel = 1;
				if (member.roles.get("400511826745360405")) permissionLevel = 2;
				if (member.roles.get("400511217061330955")) permissionLevel = 2;
			}
		}
		//0 = Non-Member or Non-Matching Roles
		//1 = Scam Reports Support
		//2 = Co-Owner & Owner
		var commandFile;
		if (message.content.startsWith(prefix)) {
			let cmd = args.shift().toLowerCase();
			commandFile = bot.commands.get(cmd.slice(prefix.length));
			if (commandFile != null) {
				var timeout = bot.data.timeout.find((value) => value.id === message.author.id);
				if (timeout == null) {
					bot.setTimeout(() => {
						bot.data.timeout.splice(bot.data.timeout.indexOf(timeout), 1);
					}, 2000);
					bot.data.timeout.push({ id: message.author.id });
					commandFile.run(bot, message, args, prefix, permissionLevel);
				} else {
					message.reply("You cannot use this command yet!").then((sentMessage) => {
						sentMessage.delete(3500).catch(function () { });
					}).catch(() => {
						message.author.send(`You attempted to use a command in ${message.channel}, but I can not chat there.`).catch(function () { });
					});
				}
			}
		} else if (new RegExp(`^<@!?${bot.user.id}>`, "").test(message.content)) {
			var mention = args[0];
			args.shift();
			if (!args[0]) return;
			commandFile = bot.commands.get(args[0].toLowerCase());
			if (commandFile != null) {
				message.mentions.members.delete(bot.user.id);
				message.mentions.users.delete(bot.user.id);
				message.content = message.content.replace(`${mention} `, prefix);
				if (bot.data.timeout.find((value) => value.id === message.author.id) == null) {
					bot.setTimeout(() => {
						bot.data.timeout.splice(bot.data.timeout.indexOf(bot.data.timeout.find((value) => value.id === message.author.id)), 1);
					}, 2000);
					bot.data.timeout.push({ id: message.author.id });
					commandFile.run(bot, message, args, prefix, permissionLevel);
				} else {
					message.reply("You cannot use this command yet!").then((sentMessage) => {
						sentMessage.delete(3500).catch(function () { });
					}).catch(() => {
						message.author.send(`You attempted to use a command in ${message.channel}, but I can not chat there.`).catch(function () { });
					});
				}

			}
		}
	}
});
bot.login(botconfig.token);
