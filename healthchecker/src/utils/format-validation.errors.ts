import { ValidationError } from 'class-validator';

export const formatValidationErrors = (errors: ValidationError[]) => {
  return errors.reduce((acc, error) => {
    acc[error.property] = Object.values(error.constraints);
    return acc;
  }, {});
};
