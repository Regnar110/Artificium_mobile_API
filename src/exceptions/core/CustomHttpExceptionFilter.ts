import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { PayloadExtendedHttpException } from './PayloadExtendedHttpException';

@Catch()
export class CustomHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const payload =
      exception instanceof PayloadExtendedHttpException
        ? exception.payload
        : {
            redirect: null,
            data: {
              clientMessage:
                'Something went wrong. Please refresh the app and try again or contact us.',
            },
          };

    const responseBody = {
      status,
      message,
      payload,
    };

    response.status(status).json(responseBody);
  }
}
