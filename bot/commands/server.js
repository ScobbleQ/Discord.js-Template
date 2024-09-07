import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { config } from '../../config.js';

/**
 * Example SlashCommand for Guilds only
 */
export default {
	data: new SlashCommandBuilder()
		.setName('translate')
		.setDescription('Translate the message or text')
		.setIntegrationTypes([0])
		.setContexts([0]),
	async execute(interaction) {
		await interaction.reply({
			embeds: [new EmbedBuilder()
				.setColor(config.embedColors.default)
				.setDescription(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`),
			],
		});
	},
};