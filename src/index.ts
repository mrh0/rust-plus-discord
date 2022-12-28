require('dotenv').config();
import { REST, Client, Routes, GatewayIntentBits, SlashCommandBuilder } from 'discord.js';
import { handler } from './events';
import { getExpoToken } from './pair';
import { AppData } from './types';

const { CLIENT_ID, TOKEN } = process.env as { [key: string]: string };

const commands = [
	new SlashCommandBuilder()
		.setName('setup')
		.setDescription('Configure configuration')
		.addStringOption(option => option
			.setName('server')
			.setRequired(true)
			.setDescription('The server address (IP or URL).'))
		.addStringOption(option => option
			.setName('id')
			.setRequired(true)
			.setDescription('Player SteamId.'))
		.addStringOption(option => option
			.setName('token')
			.setRequired(true)
			.setDescription('Player token.'))
		.addRoleOption(option => option
			.setName('role')
			.setRequired(true)
			.setDescription('Role to tag in notifications.'))
		.addStringOption(option => option
			.setName('port')
			.setRequired(false)
			.setDescription('The server port (optional).'))
		.addStringOption(option => option
			.setName('channel')
			.setRequired(false)
			.setDescription('channelId (optional).'))
];

const rest = new REST({ version: '10' }).setToken(TOKEN);
const appdata: AppData = {
	channels: {}
};

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}

	const client = new Client({ intents: [GatewayIntentBits.Guilds] });
	handler(client, appdata);
	await client.login(TOKEN);
})();