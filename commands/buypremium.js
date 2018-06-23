module.exports = {
	help: {
		name: "buypremium",
		description: "Gives you a link to buy premium",
		type: "Public"
	},
	run: async (bot, message) => {
		message.reply("**You can buy premium here!:** https://selly.gg/p/3b0483db").catch(() => {
			message.author.send(`You attempted to use the \`buypremium\` command in ${message.channel}, but I can not chat there.`).catch(function () { });
		});
	}
};
