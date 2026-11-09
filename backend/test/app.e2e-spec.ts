import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health/liveness returns HTTP 200 with ok status', async () => {
    const response = await request(app.getHttpServer())
      .get('/health/liveness')
      .expect(200);

    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toHaveProperty('status', 'ok');
    expect(response.body.meta).toHaveProperty('requestId');
    expect(response.body.meta).toHaveProperty('timestamp');
  });

  it('GET /health returns diagnostic status with service name and ITDA pilot', async () => {
    const response = await request(app.getHttpServer())
      .get('/health')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.service).toContain('AAROGYA DRISHTI');
    expect(response.body.data.pilot).toContain('ITDA Paderu');
  });

  it('attaches correlation ID header x-request-id', async () => {
    const customCorrelationId = 'test-correlation-12345';
    const response = await request(app.getHttpServer())
      .get('/health/liveness')
      .set('x-request-id', customCorrelationId)
      .expect(200);

    expect(response.headers['x-request-id']).toBe(customCorrelationId);
    expect(response.body.meta.requestId).toBe(customCorrelationId);
  });
});
