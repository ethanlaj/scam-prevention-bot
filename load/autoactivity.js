var messages = [
	"{users} users",
	"for !help",
	"on {servers} servers",
	"for !updates",
	"premium for only $3/month",
	"for !buypremium",
	"for scammers",
	"for !report",
	"on {channels} channels",
	"for !invite",
];
var activities = [
	"LISTENING",
	"WATCHING",
	"PLAYING",
	"WATCHING",
	"LISTENING",
	"WATCHING",
	"LISTENING",
	"WATCHING",
	"PLAYING",
	"WATCHING",
];

/*variables:
{users} = user count
{servers} = server count
*/

//activities correspond w/ messages
module.exports.run = async (bot) => {
	var loopNumber = 0;
	bot.setInterval(function() {
		if(!bot.auto) return;
		if (loopNumber === messages.length) loopNumber = 0;
		var message = messages[loopNumber];
		message = message.replace("{users}", bot.users.size);
		message = message.replace("{servers}", bot.guilds.size);
		bot.user.setActivity(message, { type: activities[loopNumber] }).catch(function () { });
		console.log(messages[loopNumber]);
		loopNumber++;
	}, 2000);
};