import { REST, Routes } from 'discord.js';
import { config } from '../config.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));

async function loadCommands() {
	for (const file of commandFolders) {
		const filePath = path.join(foldersPath, file);
		const command = await import(filePath);
		const cmd = command.default;

		if (cmd && 'data' in cmd && 'execute' in cmd) {
			commands.push(cmd.data.toJSON());
			console.log(`\x1b[32m[Slash Command]\x1b[0m Loaded ${cmd.data.name}`);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

(async () => {
	await loadCommands();

	const rest = new REST().setToken(config.token);

	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		const data = await rest.put(
			Routes.applicationCommands(config.clientId),
			{ body: commands },
		);
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error) {
		console.error(error);
	}
})();