import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { CORRELATION_ID_HEADER } from '../middleware/correlation-id.middleware';
import { ApiSuccessResponseDto, ResponseMetaDto } from '../dto/api-response.dto';

interface PaginatedPayload<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

function isPaginated<T>(data: unknown): data is PaginatedPayload<T> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'items' in data &&
    'total' in data &&
    'page' in data
  );
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiSuccessResponseDto<T | unknown>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponseDto<T | unknown>> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestId =
      (request.headers[CORRELATION_ID_HEADER] as string) || 'req-unknown';
    const timestamp = new Date().toISOString();

    return next.handle().pipe(
      map((data) => {
        // Handle paginated responses gracefully
        if (isPaginated(data)) {
          const meta: ResponseMetaDto = {
            requestId,
            timestamp,
            total: data.total,
            page: data.page,
            limit: data.limit,
          };
          return {
            success: true,
            data: data.items,
            meta,
          };
        }

        const meta: ResponseMetaDto = {
          requestId,
          timestamp,
        };

        return {
          success: true,
          data: data ?? null,
          meta,
        };
      }),
    );
  }
}
