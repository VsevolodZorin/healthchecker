import * as dotenv from 'dotenv';
import { IConfig } from 'src/types/config.inrerface';

dotenv.config();

export const config: IConfig = {
  app: {
    port: Number(process.env.PORT),
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN as string,
    chatId: process.env.TELEGRAM_CHANNEL_ID as string,
  },
  mail: {
    smtpHost: process.env.SMTP_HOST as string,
    smtpPort: Number(process.env.SMTP_PORT),
    smtpUser: process.env.SMTP_USER as string,
    smtpPasswors: process.env.SMTP_PASSWORD as string,
  },
  orm: {
    type: 'postgres',
    host: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
    entities: ['src/**/*.entity{.ts,.js}'],
    migrations: ['src/migrations/**/*{.ts,.js}'],
    logging: true,
    synchronize: false,
  },
};
