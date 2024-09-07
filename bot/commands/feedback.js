import {
	SlashCommandBuilder, EmbedBuilder, ActionRowBuilder,
	ButtonBuilder, ButtonStyle,
	ModalBuilder, TextInputBuilder, TextInputStyle,
} from 'discord.js';
import { config } from '../../config.js';

/**
 * Example SlashCommand for all IntegrationTypes/Contexts with Button and Modal
 */
export default {
	data: new SlashCommandBuilder()
		.setName('feedback')
		.setDescription('Send feedback to the bot developers')
		.setIntegrationTypes([0, 1])
		.setContexts([0, 1, 2]),
	async buttonClick(interaction) {
		const modal = new ModalBuilder()
			.setCustomId('feedback')
			.setTitle('Feedback Time');

		modal.addComponents(
			new ActionRowBuilder().addComponents(
				new TextInputBuilder()
					.setCustomId('feedback-input')
					.setLabel('Enter Feedback')
					.setStyle(TextInputStyle.Paragraph),
			),
		);

		await interaction.showModal(modal);
	},
	async modalSubmit(interaction) {
		const feedback = interaction.fields.getTextInputValue('feedback-input');

		await interaction.reply({
			embeds: [new EmbedBuilder()
				.setColor(config.embedColors.default)
				.setDescription(`Feedback received:\n${feedback}`)],
			ephemeral: true,
		});
	},
	async execute(interaction) {
		const row = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId('feedback')
				.setLabel('Send Feedback')
				.setStyle(ButtonStyle.Primary),
		);

		await interaction.reply({
			embeds: [new EmbedBuilder()
				.setColor(config.embedColors.default)
				.setDescription('Click the button below to send feedback to the bot developers')],
			components: [row],
			ephemeral: true,
		});
	},
};