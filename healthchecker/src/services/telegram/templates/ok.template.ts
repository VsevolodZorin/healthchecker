import { dateFormat } from 'src/utils/date-format';
import { MicroserviceEntity } from 'src/entities/microservice.entity';

export const okTgMessage = (service: MicroserviceEntity): string => {
  const message: string =
    'OK!  \n' +
    `\n` +
    `Service ${service.name} available \n` +
    `Unavailable from ${dateFormat(service.unavailableFrom)} to ${dateFormat(
      service.unavailableTo,
    )} \n` +
    `URL: ${service.checkUrl}`;

  return message;
};
