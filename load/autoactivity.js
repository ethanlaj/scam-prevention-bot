var messages = [
	"Message 1",
	"Message 2",
	"Message 3",
];
var activities = [
	"WATCHING",
	"PLAYING",
	"LISTENING",
];
//activities correspond w/ messages
module.exports.run = async (bot) => {
	var loopNumber = 0;
	bot.setInterval(function() {
		if(!bot.auto) return;
		if (loopNumber === messages.length - 1) loopNumber = 0;
		bot.user.setActivity(messages[loopNumber], { type: activities[loopNumber] }).catch(function () { });
		console.log(messages[loopNumber]);
		loopNumber++;
	}, 2000);
};