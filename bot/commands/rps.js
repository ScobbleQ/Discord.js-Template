import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } from 'discord.js';
import { config } from '../../config.js';

const choices = ['rock', 'paper', 'scissors'];
const winConditions = {
	rock: 'scissors',
	paper: 'rock',
	scissors: 'paper',
};

/**
 * Example SlashCommand for all IntegrationTypes/Contexts with StringSelectMenu Collector
 */
export default {
	data: new SlashCommandBuilder()
		.setName('rps')
		.setDescription('Play Rock Paper Scissors!')
		.setIntegrationTypes([0, 1])
		.setContexts([0, 1, 2]),

	async execute(interaction) {
		const row = new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId('rps')
				.setPlaceholder('Choose your weapon')
				.addOptions(
					new StringSelectMenuOptionBuilder()
						.setLabel('Rock')
						.setValue('rock'),
					new StringSelectMenuOptionBuilder()
						.setLabel('Paper')
						.setValue('paper'),
					new StringSelectMenuOptionBuilder()
						.setLabel('Scissors')
						.setValue('scissors'),
				),
		);

		const response = await interaction.reply({
			embeds: [new EmbedBuilder()
				.setColor(config.embedColors.default)
				.setDescription('Choose your weapon!')],
			components: [row],
		});

		const botChoice = choices[Math.floor(Math.random() * choices.length)];

		const collectorFilter = i => i.user.id === interaction.user.id;
		const collector = response.createMessageComponentCollector({ filter: collectorFilter, componentType: ComponentType.StringSelect, time: 3_600_000 });

		collector.on('collect', async i => {
			let content;

			if (i.values[0] === botChoice) {
				content = `It's a tie! I also chose ${botChoice}.`;
			}
			else if (winConditions[i.values[0]] === botChoice) {
				content = `You won! I chose ${botChoice}.`;
			}
			else {
				content = `You lost! I chose ${botChoice}.`;
			}

			await i.update({
				embeds: [new EmbedBuilder()
					.setColor(config.embedColors.default)
					.setDescription(content)],
				components: [],
			});
			collector.stop();
		});

		collector.on('end', (collected, reason) => {
			if (reason === 'time') {
				return interaction.editReply({
					embeds: [new EmbedBuilder()
						.setColor(config.embedColors.error)
						.setDescription('You took too long to respond.')],
					components: [],
				});
			}
		});
	},
};