import { Events } from 'discord.js';

export default {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`\x1b[33mSuccessfully Logged in as ${client.user.tag}\x1b[0m`);
	},
};