import { ShardingManager } from 'discord.js';
import { config } from './config.js';

const manager = new ShardingManager('./bot/bot.js', { token: config.token });

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();