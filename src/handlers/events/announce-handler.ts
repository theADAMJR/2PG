import { EventType, GuildDocument, LogEvent } from '../../data/models/guild';
import Guilds from '../../data/guilds';
import { Guild, TextChannel } from 'discord.js';
import Deps from '../../utils/deps';
import Event from './event-handler';

export default abstract class implements Event {
  abstract on: string;
  abstract event: EventType;

  constructor(protected guilds = Deps.get<Guilds>(Guilds)) {}

  protected async getEvent(guild: Guild, savedGuild?: GuildDocument) {
    savedGuild ??= await this.guilds.get(guild);
    
    const event = savedGuild.logs.events.find(e => e.event === this.event);
    return (savedGuild.logs.enabled && event?.enabled) ? event : null;
  }

  protected getChannel(config: LogEvent, guild: Guild) {
    return guild.channels.cache.get(config?.channel) as TextChannel;
  }

  protected async announce(guild: Guild, applyEventArgs: any[], savedGuild?: GuildDocument) {
    const config = await this.getEvent(guild, savedGuild);    
    if (!config) return;

    const message = await this.applyEventVariables(config.message, ...applyEventArgs);

    if (message.length <= 0) return;
    
    let channel = this.getChannel(config, guild);
    await channel?.send(message);
  }

  protected abstract applyEventVariables(...args: any[]): string | Promise<string>;

  abstract invoke(...args: any[]): Promise<any> | void;
}
