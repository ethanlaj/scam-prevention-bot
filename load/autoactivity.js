var messages = [
	"for !report",
	"Watching for !updates",
	"for !updates"
];
var activities = [
	"WATCHING",
	"PLAYING",
	"WATCHING",
];
//activities correspond w/ messages
module.exports.run = async (bot) => {
	var loopNumber = 0;
	bot.setInterval(function() {
		if(!bot.auto) return;
		if (loopNumber === messages.length) loopNumber = 0;
		bot.user.setActivity(messages[loopNumber], { type: activities[loopNumber] }).catch(function () { });
		console.log(messages[loopNumber]);
		loopNumber++;
	}, 30000);
};