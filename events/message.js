// This event handles the reading of every message received in the server
// This includes mentions (Cleverbot)

module.exports = (client, message) => {
	// Cleverbot stuff
	var Cleverbot = require("cleverbot-node");
	cleverbot = new Cleverbot;
	cleverbot.configure({botapi: "CCCkuYdUalEL5JP4RAgWQxXU6NA"});

	// Ignore all bots
	if(message.author.bot)
		return;

	// Check to see if the bot was mentioned
	const prefixMention = message.content.slice(0, client.config.botID.length+1).trim();
	if(prefixMention === client.config.botID) {
		var msg = message.content.slice(client.config.botID.length+1);
		
		// Deal with empty message
		if(!msg)
			return message.reply("Why u be saying nothing to me, b?");

		// Invoke Cleverbot with message text
		message.channel.startTyping();
		cleverbot.write(msg, function (response) {
			message.reply(response.output);
		});
		message.channel.stopTyping();

		return;
	}

	// Check for offensive message
	const offensiveMsg = "nig";
	if(message.content.toLowerCase().match(offensiveMsg)) {
		return message.reply(lolzMsgs[Math.floor("<:bruh:517226415725346827>");
	}

	// At this point, ignore messages not starting with the prefix '!'
	if(message.content.indexOf(client.config.prefix) !== 0)
		return;

	// Separate message into args and command
	const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
	const command = args.shift();

	// Get command data from the commands Enmap in index.js
	const cmd = client.commands.get(command);
	
	// If command doesn't exist, silently exit and do nothing
	if(!cmd)
		return;
	
	// Otherwise, run the comand
	cmd.run(client, message, args);
};