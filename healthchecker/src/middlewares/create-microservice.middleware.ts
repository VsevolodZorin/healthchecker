import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { BackendErrorsTemplate } from 'src/shared/backend-errors.template';
import { formatValidationErrors } from 'src/utils/format-validation.errors';
import { CreateMicroseviceValidation } from 'src/validation/create-microservice.validation';

export const createMicroserviceMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { name, checkUrl } = request.body as CreateMicroseviceValidation;

    const errors = await validate(
      new CreateMicroseviceValidation(name, checkUrl),
    );
    if (errors.length) {
      const err = formatValidationErrors(errors);

      response
        .status(400)
        .send(new BackendErrorsTemplate(400, 'validation error', err));
    } else {
      next();
    }
  } catch (error) {
    response.status(400).send(new BackendErrorsTemplate(400, error.message));
  }
};
