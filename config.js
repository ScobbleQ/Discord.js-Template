import dotenv from 'dotenv';
dotenv.config();

export const config = {
	token: process.env.TOKEN || '',
	clientId: process.env.CLIENT_ID || '',
	clientSecret: process.env.CLIENT_SECRET || '',
	prefix: 'x!',
	mongoUri: process.env.MONGO_URI || '',
	embedColors: {
		default: '#576EFF',
		success: '#77DD77',
		error: '#FF6961',
		warning: '#FDFD96',
	},
};