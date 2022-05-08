export class BackendErrorsTemplate {
  status: number;
  message: string;
  errors?: {
    [key: string]: string[];
  };
  constructor(status: number, message: string, errors?: {}) {
    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}
