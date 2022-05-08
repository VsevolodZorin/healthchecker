import { NextFunction, Request, Response } from 'express';
import { BackendErrorsTemplate } from 'src/shared/backend-errors.template';

export const checkIdParamMiddleware = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { id } = request.params;

    if (Number.isInteger(+id)) {
      return next();
    } else {
      return response.status(400).send(
        new BackendErrorsTemplate(400, 'validation error', {
          id: ['is not a number'],
        }),
      );
    }
  } catch (error) {
    return response
      .status(400)
      .send(new BackendErrorsTemplate(400, error.message));
  }
};
