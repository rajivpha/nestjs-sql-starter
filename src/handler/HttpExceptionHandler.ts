import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Response } from "express";
import { ValidationError } from "class-validator";

@Catch()
export class HttpExceptionHandler implements ExceptionFilter {
  constructor() {}

  async catch(exception: any, host: ArgumentsHost): Promise<any> {
    try {
      const response: Response = host.switchToHttp().getResponse();

      const errorObj = {
        status: 500,
        success: false,
        message: "Something Went Wrong!",
        description: null,
      };

      errorObj.message = exception.message;

      console.log(exception.stack);

      errorObj.description =
        exception.description || errorObj.description || null;

      errorObj.status = exception.status || errorObj.status;

      if (exception instanceof UnprocessableEntityException) {
        const validationErrors = exception.getResponse()["message"];

        let formattedErrors = [];
        if (Array.isArray(validationErrors)) {
          formattedErrors = this.formatValidationErrors(validationErrors);
        } else {
          formattedErrors.push(validationErrors);
        }

        errorObj.message = "validation error";
        errorObj.description = formattedErrors;
      }
      if (!response.headersSent)
        response.status(errorObj.status).json(errorObj).send();
    } catch (ex) {
      console.log(ex);
    }
  }

  private formatValidationErrors(errors: ValidationError[]) {
    const formattedErrors = [];
    for (const error of errors) {
      if (error?.children?.length) {
        // Recursively format nested errors
        formattedErrors.push(...this.formatValidationErrors(error.children));
      } else {
        if (error.constraints && error.property) {
          // Pick the first error message from constraints object
          const message = Object.values(error.constraints)[0];
          formattedErrors.push({
            property: error.property,
            message,
          });
        }
        formattedErrors.push(error);
      }
    }
    return formattedErrors;
  }
}
