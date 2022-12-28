import { Client } from 'discord.js';
import { AppData } from './types';

export const handler = (client: Client, data: AppData) => {
	client.on('ready', () => {
		console.log(`Logged in as ${client.user?.tag}!`);
	});

	client.on('interactionCreate', async (interaction) => {
		if (!interaction.isChatInputCommand()) return;

		if (interaction.commandName === 'ping') {
			await interaction.reply('Pong!');
		}

		if (interaction.commandName === 'setup') {
			const channel = interaction.options.getString('channel') ?? interaction.channelId
			data.channels[channel] = {
				server: interaction.options.getString('server', true),
				playerId: interaction.options.getString('id', true),
				playerToken: interaction.options.getString('token', true),
				role: interaction.options.getString('role', true),
				port: interaction.options.getInteger('port') ?? 0,
				id: channel,
			}
			console.log('Options: ', data.channels[channel]);
			await interaction.reply('Pong!');
		}

		
	});
}
