import { ApiProperty } from '@nestjs/swagger';

export class ResponseMetaDto {
  @ApiProperty({ description: 'Unique request correlation ID', example: 'req-c8b1a320-f19e-4e4b-9e4f' })
  requestId: string;

  @ApiProperty({ description: 'ISO 8601 server timestamp', example: '2026-10-30T10:30:00.000Z' })
  timestamp: string;

  @ApiProperty({ description: 'Total records if paginated', required: false, example: 42 })
  total?: number;

  @ApiProperty({ description: 'Current page number', required: false, example: 1 })
  page?: number;

  @ApiProperty({ description: 'Records per page', required: false, example: 20 })
  limit?: number;
}

export class ApiSuccessResponseDto<T> {
  @ApiProperty({ description: 'Success flag', example: true })
  success: boolean;

  @ApiProperty({ description: 'Payload data' })
  data: T;

  @ApiProperty({ description: 'Response metadata', type: ResponseMetaDto })
  meta: ResponseMetaDto;
}

export class ApiErrorDetailDto {
  @ApiProperty({ description: 'Field that caused error', example: 'contactPhone' })
  field?: string;

  @ApiProperty({ description: 'Error message', example: 'Invalid phone format' })
  message: string;
}

export class ApiErrorPayloadDto {
  @ApiProperty({ description: 'Machine readable error code', example: 'VALIDATION_ERROR' })
  code: string;

  @ApiProperty({ description: 'Human readable error description', example: 'Request validation failed' })
  message: string;

  @ApiProperty({ description: 'List of granular errors', type: [ApiErrorDetailDto], required: false })
  details?: ApiErrorDetailDto[];
}

export class ApiErrorResponseDto {
  @ApiProperty({ description: 'Success flag', example: false })
  success: boolean;

  @ApiProperty({ description: 'Error details', type: ApiErrorPayloadDto })
  error: ApiErrorPayloadDto;

  @ApiProperty({ description: 'Response metadata', type: ResponseMetaDto })
  meta: ResponseMetaDto;
}
