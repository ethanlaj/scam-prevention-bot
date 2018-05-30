const botconfig = require("./botconfig.js");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true, fetchAllMembers: true});
bot.loaders = { enabledLoaders: [], disabledLoaders: [] };
bot.data = { prefixes: [], inPrompt: [], blacklistedUsers: [], blacklistedGuilds: [], scammers: [], codes: [], pusers: [], timeout: []};
bot.counter = false;
bot.commands = new Discord.Collection();

fs.readdirSync(__dirname + "/load").forEach(file => {
	try {
		let loader = require("./load/" + file);
		bot.loaders.enabledLoaders.push(loader);
	} catch(err) {
		bot.loaders.disabledLoaders.push(file);
		console.log(`\nThe ${file} load module failed to load:`);
		console.log(err);
	}
});

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
	jsfiles = files.filter(f => f.endsWith(".js"));
	if (jsfiles.length <= 0) return console.log("Couldn't find commands.");
	jsfiles.forEach((f) => {
		try {
			var props = require(`./commands/${f}`);
			if (checkCommand(props, f)[0]) {
				bot.commands.set(props.help.name, props);
			} else {
				throw checkCommand(props, f)[1];
			}
		} catch(err) {
			bot.disabledCommands.push(f);
			console.log(`\nThe ${f} command failed to load:`);
			console.log(err);
		}
	});
});
bot.on("ready", async () => {
	bot.loaders.enabledLoaders.forEach(loader => {
		if (loader.run != null)
			loader.run(bot);
	});
	console.log(`${bot.user.username} is online!`);
	await bot.user.setActivity("for !help", { type: "WATCHING" }).catch(function () { });
});

bot.on("message", async message => {
	if (message.author.bot) return;
	if (message.channel.type === "dm") return;
	var messageArray = message.content.split(" ");
	var cmd = messageArray[0].toLowerCase();
	var args = messageArray.slice(1);
	var rawPrefix = bot.data.prefixes.find(value => value.guild === message.guild.id);
	var prefix;
	if (!rawPrefix) prefix = botconfig.prefix;
	if (rawPrefix) prefix = rawPrefix.prefix;
	if ((message.isMemberMentioned(bot.user)) && (message.content.endsWith("prefix"))) {
		if(bot.data.timeout.find(value => value.id === message.author.id)) return message.reply("You cannot use this command yet!").catch(() => {
			return message.author.send(`You attempted to use a command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
		bot.data.timeout.push({ id: message.author.id });
		bot.setTimeout(function() {
			bot.data.timeout.splice(bot.data.timeout.indexOf(bot.data.timeout.find(value => value.id === message.author.id)), 1);
		}, 2000);
		return message.reply(`My prefix is \`${prefix}\``).catch(() => {
			return message.author.send(`You attempted to use a command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
	}
	if ((message.isMemberMentioned(bot.user)) && (message.content.endsWith("prefix reset")) && (message.member.hasPermission("MANAGE_GUILD"))) {
		if(bot.data.timeout.find(value => value.id === message.author.id)) return message.reply("You cannot use this command yet!").catch(() => {
			return message.author.send(`You attempted to use a command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
		if (prefix !== botconfig.prefix) {
			bot.data.prefixes.splice(bot.data.prefixes.indexOf(bot.data.prefixes.find(value => value.guild === message.guild.id)), 1);
			if (rawPrefix) rawPrefix.msg.delete();
			bot.data.timeout.push({ id: message.author.id });
			bot.setTimeout(function() {
				bot.data.timeout.splice(bot.data.timeout.indexOf(bot.data.timeout.find(value => value.id === message.author.id)), 1);
			}, 2000);
			return message.react("\u2705").catch(function () { });
		} else {
			bot.data.timeout.push({ id: message.author.id });
			bot.setTimeout(function() {
				bot.data.timeout.splice(bot.data.timeout.indexOf(bot.data.timeout.find(value => value.id === message.author.id)), 1);
			}, 2000);
			return message.react("\u2705").catch(function () { });
		}
	}
	if (bot.data.pusers.find(value => value.id === message.author.id) && bot.data.pusers.find(value => value.id === message.author.id).expires !== "0" && bot.data.pusers.find(value => value.id === message.author.id).expires < Date.now()) {
		bot.data.pusers.find(value => value.id === message.author.id).msg.delete();
		bot.data.pusers.splice(bot.data.pusers.indexOf(bot.data.pusers.find(value => value.id === message.author.id)), 1);
		message.author.send("Your premium has expired!").catch(function () { });
	}
	let guild = bot.guilds.find("id", "443867131721941005");
	var permissionLevel = 0;
	if (guild.members.get(message.author.id)) {
		var member = await guild.fetchMember(message.author.id);
		if (member.roles) {
			if (member.roles.get("443903247502147596")) permissionLevel = 1;
			if (member.roles.get("443898332029517824")) permissionLevel = 2;
			if (member.roles.get("443867603103121410")) permissionLevel = 3;
		}
	}
	//0 = Non-Member or Non-Matching Roles
	//1 = Moderators
	//2 = Helper
	//3 = Developers
	if (message.content.startsWith(prefix)) {
		let commandfile = bot.commands.get(cmd.slice(prefix.length));
		if (!commandfile) return;
		if(bot.data.timeout.find(value => value.id === message.author.id)) return message.reply("You cannot use this command yet!").catch(() => {
			return message.author.send(`You attempted to use a command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
		bot.setTimeout(function() {
			bot.data.timeout.splice(bot.data.timeout.indexOf(bot.data.timeout.find(value => value.id === message.author.id)), 1);
		}, 2000);
		bot.data.timeout.push({ id: message.author.id });
		return commandfile.run(bot, message, args, prefix, permissionLevel);
	} else if (message.content.startsWith(`<@!${bot.user.id}>`) || message.content.startsWith(`<@${bot.user.id}>`)) {
		let commandfile = bot.commands.get(args[0].toLowerCase());
		if (!commandfile) return;
		if (message.content.startsWith(`<@${bot.user.id}>`)) {
			message.content = message.content.replace(`<@${bot.user.id}> `, `${prefix}`);
		} else if (message.content.startsWith(`<@!${bot.user.id}>`)) {
			message.content = message.content.replace(`<@!${bot.user.id}> `, `${prefix}`);
		}
		messageArray = message.content.split(" ");
		args = messageArray.slice(1);
		if(bot.data.timeout.find(value => value.id === message.author.id)) return message.reply("You cannot use this command yet!").catch(() => {
			return message.author.send(`You attempted to use a command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
		bot.setTimeout(function() {
			bot.data.timeout.splice(bot.data.timeout.indexOf(bot.data.timeout.find(value => value.id === message.author.id)), 1);
		}, 2000);
		bot.data.timeout.push({ id: message.author.id });
		return commandfile.run(bot, message, args, prefix, permissionLevel);
	}
});
bot.login(botconfig.token);
