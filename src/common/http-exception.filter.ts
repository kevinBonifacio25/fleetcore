/** Formats HTTP and PostgreSQL errors into the API's standard error response. */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';

interface PostgresError {
  code?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Error interno del servidor';

    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const body: unknown = exception.getResponse();

      if (typeof body === 'string') {
        message = body;
      } else if (
        typeof body === 'object' &&
        body !== null &&
        'message' in body
      ) {
        const value = (body as { message: unknown }).message;

        if (
          typeof value === 'string' ||
          (Array.isArray(value) &&
            value.every((item) => typeof item === 'string'))
        ) {
          message = value;
        }
      }
    } else if (exception instanceof QueryFailedError) {
      const driverError = exception.driverError as PostgresError;

      if (driverError.code === '23505') {
        status = HttpStatus.CONFLICT;
        message = 'Ya existe un registro con uno de los valores únicos enviados';
      }
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
