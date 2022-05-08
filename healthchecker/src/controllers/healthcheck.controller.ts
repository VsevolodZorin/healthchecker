import { NextFunction, Request, Response } from 'express';
import { Repository } from 'typeorm';
import db from 'src/db';
import { dateFormat } from 'src/utils/date-format';
import { MicroserviceEntity } from 'src/entities/microservice.entity';
import { BackendErrorsTemplate } from 'src/shared/backend-errors.template';
import { fetchWithTimeout } from 'src/utils/fetch-with-timeout';
import { MicroserviceStatusEnum } from 'src/types/microservice-status.enum';
import { telegramService } from 'src/services/telegram';
import { okTgMessage } from 'src/services/telegram/templates/ok.template';
import { alertTgMessage } from 'src/services/telegram/templates/alert.template';

type SingleMsResponse = Pick<MicroserviceEntity, 'id' | 'name' | 'checkUrl'>;

class HealthcheckController {
  constructor(private readonly repository: Repository<MicroserviceEntity>) {}

  all = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const all = await this.repository.find();
      return response.status(200).send(this.buildMultipleServicesResponse(all));
    } catch (error) {
      return response
        .status(400)
        .send(new BackendErrorsTemplate(400, error.message));
    }
  };

  create = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { name, checkUrl } = request.body;

      const service = await this.repository.findOne({ where: { name } });
      if (service) {
        throw new Error('service name already exist');
      }

      const newService = new MicroserviceEntity();
      Object.assign(newService, { name, checkUrl });
      const savedService = await this.repository.save(newService);

      return response
        .status(201)
        .send(this.buildSingleServiceResponse(savedService));
    } catch (error) {
      return response
        .status(422)
        .send(new BackendErrorsTemplate(422, error.message));
    }
  };

  update = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { name, checkUrl } = request.body;

      const service = await this.repository.findOne({ where: { name } });

      if (!service) {
        return response.status(404).send(
          new BackendErrorsTemplate(404, `not found`, {
            name: ['can not find service for update'],
          }),
        );
      }

      Object.assign(service, { name, checkUrl });
      const updated = await this.repository.save(service);

      return response
        .status(200)
        .send(this.buildSingleServiceResponse(updated));
    } catch (error) {
      return response
        .status(422)
        .send(new BackendErrorsTemplate(422, error.message));
    }
  };

  delete = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;

      const { affected } = await this.repository.delete(id);

      return response.status(202).send({ deleted: affected });
    } catch (error) {
      return response.status(400).send(
        new BackendErrorsTemplate(400, 'delete service error catch', {
          error: error.message,
        }),
      );
    }
  };

  check = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { id } = request.params;

      const service = await this.repository.findOne({ where: { id: +id } });
      if (!service) {
        return response.status(404).send(
          new BackendErrorsTemplate(404, `not found`, {
            id: ['can not find service'],
          }),
        );
      }

      const { statusText, code } = await fetchWithTimeout(service.checkUrl);
      let updatedService: MicroserviceEntity;

      if (statusText === 'OK') {
        // off -> on
        if (service.status === MicroserviceStatusEnum.unavailable) {
          service.unavailableTo = new Date();
          service.status = MicroserviceStatusEnum.available;
        }
        // on -> on -> next()

        updatedService = await this.repository.save(service);
        await telegramService.sendMessage(okTgMessage(updatedService));

        // ------------------------------------------
      } else {
        // on -> off
        if (service.status === MicroserviceStatusEnum.available) {
          service.unavailableFrom = new Date();
          service.unavailableTo = null;
          service.status = MicroserviceStatusEnum.unavailable;
        }
        // off -> off -> next()

        updatedService = await this.repository.save(service);
        await telegramService.sendMessage(alertTgMessage(updatedService, code));

        // second check
        setTimeout(() => {
          this.secondCheckStatus(id);
          // custom time for check
        }, 20000);
      }

      return response
        .status(200)
        .send(this.buildCheckStatusResponse(updatedService));
    } catch (error) {
      return response.status(400).send(
        new BackendErrorsTemplate(400, 'check status catch', {
          error: error.message,
        }),
      );
    }
  };

  secondCheckStatus = async (id) => {
    const service = await this.repository.findOne({ where: { id: +id } });
    if (!service) {
      return;
    }

    const { statusText } = await fetchWithTimeout(service.checkUrl);
    let updatedService: MicroserviceEntity;

    if (statusText === 'OK') {
      // off -> on
      if (service.status === MicroserviceStatusEnum.unavailable) {
        service.unavailableTo = new Date();
        service.status = MicroserviceStatusEnum.available;
      }
      // on -> on -> next()

      updatedService = await this.repository.save(service);
      await telegramService.sendMessage(okTgMessage(updatedService));
    }
  };

  buildCheckStatusResponse = (service: MicroserviceEntity) => {
    const { status, unavailableFrom, unavailableTo } = service;

    return {
      status,
      unavailableFrom: dateFormat(unavailableFrom),
      unavailableTo: dateFormat(unavailableTo),
    };
  };

  buildSingleServiceResponse = (
    service: MicroserviceEntity,
  ): SingleMsResponse => {
    console.log('--- single serv', service);

    const { id, name, checkUrl } = service;
    return { id, name, checkUrl };
  };

  buildMultipleServicesResponse = (
    services: MicroserviceEntity[],
  ): SingleMsResponse[] => {
    return services.map((el) => this.buildSingleServiceResponse(el));
  };
}

export const healthcheckController = new HealthcheckController(
  db.getRepository(MicroserviceEntity),
);
