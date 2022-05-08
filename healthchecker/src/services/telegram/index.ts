import { config } from 'src/config';
import { Telegraf } from 'telegraf';
import { ITelegramConfig } from 'src/types/telegram.interface';

class TelegramService {
  private bot: Telegraf;
  private config: ITelegramConfig;

  constructor(config: ITelegramConfig) {
    this.bot = new Telegraf(config.botToken);
    this.config = config;
  }

  async sendMessage(message: string, chatId: string = this.config.chatId) {
    try {
      await this.bot.telegram.sendMessage(chatId, message);
    } catch (e) {
      console.log('--- telegram sendMessage catch', e.message);
    }
  }
}

export const telegramService = new TelegramService(config.telegram);
