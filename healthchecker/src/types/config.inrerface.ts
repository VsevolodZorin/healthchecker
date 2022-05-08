import { DataSourceOptions } from 'typeorm';
import { IApp } from './app.interface';
import { IMailConfig } from './mail.interface';
import { ITelegramConfig } from './telegram.interface';

export interface IConfig {
  app: IApp;
  telegram: ITelegramConfig;
  mail: IMailConfig;
  orm: DataSourceOptions;
}
