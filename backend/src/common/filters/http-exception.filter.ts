import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CORRELATION_ID_HEADER } from '../middleware/correlation-id.middleware';
import { ApiErrorResponseDto } from '../dto/api-response.dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId =
      (request.headers[CORRELATION_ID_HEADER] as string) || 'req-unknown';
    const timestamp = new Date().toISOString();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let errorMessage = 'An unexpected server error occurred. Please try again.';
    let errorDetails: Array<{ field?: string; message: string }> | undefined =
      undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        errorMessage = res;
        errorCode = this.statusToErrorCode(status);
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, unknown>;
        errorCode =
          (resObj.error as string) || this.statusToErrorCode(status);
        errorMessage =
          (resObj.message as string) || exception.message || 'Error occurred';

        // class-validator array formatting
        if (Array.isArray(resObj.message)) {
          errorCode = 'VALIDATION_ERROR';
          errorMessage = resObj.message.join(' • ');
          errorDetails = resObj.message.map((msg: string) => {
            const firstSpace = msg.indexOf(' ');
            if (firstSpace > 0) {
              const field = msg.substring(0, firstSpace);
              return { field, message: msg };
            }
            return { message: msg };
          });
        }
      }
    } else if (exception instanceof Error) {
      this.logger.error(
        `[${requestId}] Unhandled Exception: ${exception.message}`,
        exception.stack,
      );
      if (process.env.NODE_ENV === 'development') {
        errorMessage = exception.message;
      }
    }

    const payload: ApiErrorResponseDto = {
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
        ...(errorDetails ? { details: errorDetails } : {}),
      },
      meta: {
        requestId,
        timestamp,
      },
    };

    response.status(status).json(payload);
  }

  private statusToErrorCode(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN_RESOURCE';
      case HttpStatus.NOT_FOUND:
        return 'RESOURCE_NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'RESOURCE_CONFLICT';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'RATE_LIMIT_EXCEEDED';
      case HttpStatus.SERVICE_UNAVAILABLE:
        return 'SERVICE_UNAVAILABLE';
      default:
        return 'API_ERROR';
    }
  }
}
