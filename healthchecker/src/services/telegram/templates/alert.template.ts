import { MicroserviceEntity } from 'src/entities/microservice.entity';

export const alertTgMessage = (
  service: MicroserviceEntity,
  error: string,
): string => {
  // todo all errors
  // ECONNABORTED' = timeout
  // ECONNREFUSED = offline
  const msg: string =
    error === 'ECONNREFUSED' ? `Status code 503` : `Latency >700ms`;
  const message: string =
    `Alert!  \n` +
    `\n` +
    `Service ${service.name} unavailable \n` +
    `${msg}  \n` +
    `URL: ${service.checkUrl}`;

  return message;
};
