import { EmbedBuilder, ContextMenuCommandBuilder, ApplicationCommandType } from 'discord.js';
import hljs from 'highlight.js';
import { config } from '../../config.js';

/**
 * Example ContextMenu command for Messages
 */
export default {
	data: new ContextMenuCommandBuilder()
		.setName('Format Code')
		.setType(ApplicationCommandType.Message),

	async execute(interaction) {
		const { content } = interaction.targetMessage;

		const { language } = hljs.highlightAuto(content);
		const formattedCode = language === 'text'
			? 0
			: `\`\`\`${language}\n${content}\n\`\`\``;

		const embed = new EmbedBuilder()
			.setColor(formattedCode === 0 ? config.embedColors.error : config.embedColors.default)
			.setDescription(formattedCode === 0
				? 'No language detected.'
				: formattedCode);

		await interaction.reply({
			embeds: [embed],
			ephemeral: formattedCode === 0,
		});
	},
};