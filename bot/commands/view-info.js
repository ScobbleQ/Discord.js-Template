import { EmbedBuilder, ContextMenuCommandBuilder, ApplicationCommandType } from 'discord.js';
import { config } from '../../config.js';

/**
 * Example ContextMenu command for Users
 */
export default {
	data: new ContextMenuCommandBuilder()
		.setName('View Info')
		.setType(ApplicationCommandType.User),
	async execute(interaction) {
		const user = interaction.targetUser;

		const embed = new EmbedBuilder()
			.setColor(config.embedColors.default)
			.setDescription(`User: ${user.tag}\nID: ${user.id}`);

		interaction.user.id === user.id ?
			await interaction.reply({
				embeds: [embed],
				ephemeral: true,
			}) :
			await interaction.reply({
				embeds: [embed],
			});
	},
};