import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Health & Monitoring')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @Public()
  @Get('liveness')
  @ApiOperation({ summary: 'Liveness probe for container orchestrators' })
  @ApiResponse({ status: 200, description: 'Application is alive and responding' })
  getLiveness(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('readiness')
  @ApiOperation({ summary: 'Readiness probe checking system resources' })
  @HealthCheck()
  getReadiness() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024), // 300MB heap limit
    ]);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Comprehensive service diagnostic status' })
  getSystemStatus() {
    return {
      service: 'AAROGYA DRISHTI Backend Engine',
      serviceTe: 'ఆరోగ్య దృష్టి బ్యాకెండ్ ఇంజిన్',
      mission: 'Every Smile Deserves Care | ప్రతి చిరునవ్వుకు ఆరోగ్య సంరక్షణ అవసరం',
      pilot: 'ITDA Paderu, Alluri Sitharama Raju District, Andhra Pradesh',
      version: '1.0.0',
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    };
  }
}
