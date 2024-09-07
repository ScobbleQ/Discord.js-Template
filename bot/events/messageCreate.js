import { Events } from 'discord.js';
import { evaluate } from 'mathjs';
import { config } from '../../config.js';

export default {
	name: Events.MessageCreate,
	async execute(message, client) {
		const mention = `<@${client.user.id}>`;

		if (message.author.bot) return;

		if (message.content.startsWith(config.prefix) || message.content.startsWith(mention)) {
			const content = message.content.startsWith(config.prefix)
				? message.content.slice(config.prefix.length)
				: message.content.slice(mention.length);

			const args = content.trim().split(/ +/);
			const commandName = args[0].toLowerCase();
			const params = args.slice(1).join(' ');

			if (commandName === 'solve') {
				try {
					const result = evaluate(params);
					await message.reply(`The result is ${result}.`);
				}
				catch (error) {
					await message.reply(error);
				}
			}
		}
	},
};