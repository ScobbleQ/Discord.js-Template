import { Events, Collection, EmbedBuilder } from 'discord.js';
import { config } from '../../config.js';

export default {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			const { cooldowns } = interaction.client;

			if (!cooldowns.has(command.data.name)) {
				cooldowns.set(command.data.name, new Collection());
			}

			const now = Date.now();
			const timestamps = cooldowns.get(command.data.name);
			const defaultCooldownDuration = 3;
			const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

			if (timestamps.has(interaction.user.id)) {
				const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

				if (now < expirationTime) {
					const expiredTimestamp = Math.round(expirationTime / 1000);
					return interaction.reply({
						content: `Please wait, you are on a cooldown for \`/${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
						ephemeral: true,
					});
				}
			}

			timestamps.set(interaction.user.id, now);
			setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

			try {
				await command.execute(interaction);
			}
			catch (error) {
				await handleError(interaction, error);
			}
		}
		else if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.autocomplete(interaction);
			}
			catch (error) {
				await handleError(interaction, error);
			}
		}
		else if (interaction.isButton() || interaction.isModalSubmit()) {
			const command = interaction.client.commands.get(interaction.customId);

			try {
				if (interaction.isButton()) {
					await command.buttonClick(interaction);
				}
				else if (interaction.isModalSubmit()) {
					await command.modalSubmit(interaction);
				}
			}
			catch (error) {
				await handleError(interaction, error);
			}
		}
		else if (interaction.isStringSelectMenu()) {
			console.log(interaction.values[0]);
		}
	},
};

async function handleError(interaction, error) {
	console.error(`\x1b[31m[ERROR]\x1b[0m ${error} trying to execute ${interaction.commandName}`);

	const errorEmbed = new EmbedBuilder()
		.setColor(config.embedColors.error)
		.setTitle('Uh oh! Something went wrong!')
		.setDescription(`${error}`)
		.setFooter({ text: 'Please try again later and let me know via /feedback!' });

	if (interaction.replied || interaction.deferred) {
		await interaction.editReply({
			content: '',
			embeds: [errorEmbed],
			components: [],
			files: [],
			ephemeral: true,
		});
	}
	else {
		await interaction.reply({
			content: '',
			embeds: [errorEmbed],
			components: [],
			files: [],
			ephemeral: true,
		});
	}
}