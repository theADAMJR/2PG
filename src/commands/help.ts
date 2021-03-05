import { Command, CommandContext, Permission } from './command';

export default class HelpCommand implements Command {
  name = 'help';
  summary = 'Get a link to list all commands.';
  precondition: Permission = '';
  cooldown = 3;
  module = 'General';
  
  execute = async(ctx: CommandContext) => {
    await ctx.channel.send(`${process.env.DASHBOARD_URL}/commands?guild_id=${ctx.guild.id}`);
  }
}
