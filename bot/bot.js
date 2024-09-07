import fs from 'node:fs';
import path from 'node:path';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { config } from '../config.js';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
	partials: [
		Partials.Channel,
	],
});

client.cooldowns = new Collection();
client.commands = new Collection();

async function initializeDiscordBot() {
	try {
		const foldersPath = path.join(__dirname, 'commands');
		const commandFolders = fs.readdirSync(foldersPath);

		for (const file of commandFolders) {
			const filePath = path.join(foldersPath, file);
			const command = await import(filePath);
			if ('data' in command.default && 'execute' in command.default) {
				client.commands.set(command.default.data.name, command.default);
			}
			else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}

		const eventsPath = path.join(__dirname, 'events');
		const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

		for (const file of eventFiles) {
			const filePath = path.join(eventsPath, file);
			const event = await import(filePath);
			if (event.default.once) {
				client.once(event.default.name, (...args) => event.default.execute(...args));
			}
			else {
				client.on(event.default.name, (...args) => event.default.execute(...args, client));
			}
			console.log(`\x1b[32m[Event]\x1b[0m Loaded ${event.default.name}`);
		}

		client.login(config.token);
	}
	catch (error) {
		console.error(`\x1b[31m[ERROR]\x1b[0m ${error} while initializing bot`);
	}
}

initializeDiscordBot();