import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { json, Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.use('/api/v1/medgemma/analyze', json({ limit: '16mb' }));
  app.use(json({ limit: '2mb' }));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:5173');

  app.use((req:Request,res:Response,next:NextFunction)=>{
    res.setHeader('Cache-Control','no-store');
    if(!['GET','HEAD','OPTIONS'].includes(req.method)) {
      const origin=req.headers.origin;
      const allowed=corsOrigin.split(',').map(x=>x.trim());
      if((origin && !allowed.includes(origin)) || (req.headers.cookie && req.headers['x-session-mode']!=='cookie')) {res.status(403).json({message:'ORIGIN_REJECTED'});return;}
    }
    next();
  });
  // Security Headers via Helmet
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Cross-Origin Resource Sharing
  app.enableCors({
    origin: corsOrigin.includes(',') ? corsOrigin.split(',') : corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'X-Session-Mode',
      'X-Remember-Me',
      'Authorization',
      'X-Idempotency-Key',
      'x-request-id',
      'Accept-Language',
    ],
  });

  // Global API Prefix (excluding health probes for Kubernetes/Docker compatibility)
  app.setGlobalPrefix(apiPrefix, {
    exclude: ['health', 'health/(.*)'],
  });

  // Global Request Validation Pipeline
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Exception & Response Envelope Interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor(), new LoggingInterceptor());

  // Swagger OpenAPI 3.0 Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('AAROGYA DRISHTI Community Healthcare API')
    .setTitle('AAROGYA DRISHTI (ఆరోగ్య దృష్టి) — Clinical Platform API')
    .setDescription(
      'Production-oriented REST API for oral cancer early screening, clinical triage, telemedicine, hospital referrals, and offline synchronization in tribal habitations of Alluri Sitharama Raju District (ITDA Paderu, Andhra Pradesh).\n\n' +
      '**Core Ethical Principle:** *Technology reaches the patient; the patient never has to reach technology.*\n\n' +
      '**Clinical Safety:** AI research outputs are strictly non-clinical (`score: null`). Primary clinical decisions are signed by authorized Medical Officers.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your JWT Bearer token',
        in: 'header',
      },
      'JWT-Auth',
    )
    .addTag('Health & Monitoring', 'Service liveness, readiness, and diagnostic probes')
    .addTag('Authentication & Sessions', 'Role-based login and session security')
    .addTag('Patient Management', 'Assisted patient enrollment without mandatory phone or account')
    .addTag('Patient Health Card', 'Printable physical credentials and non-sensitive QR tokens')
    .addTag('Informed Consent', 'Bilingual verbal and witnessed consent records')
    .addTag('Clinical Screening Intake', 'Doorstep risk questionnaire and tobacco habit assessment')
    .addTag('Image Storage & Quality', 'Private S3 storage and OpenCV blur/lighting analysis')
    .addTag('AI Research Demonstration', 'Non-clinical demonstration adapter with strict safety gates')
    .addTag('Doctor Review & Triage', 'Independent clinician assessment and referral generator')
    .addTag('Hospital & Referrals', 'Specialist OPD allocation, biopsy tracking, and tribal navigation')
    .addTag('Offline Synchronization', 'Idempotent batch processing and conflict management')
    .addTag('District Administration', 'Coverage saturation maps and mission analytics')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'AAROGYA DRISHTI API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
    },
  });

  await app.listen(port);

  logger.log(`🌿 AAROGYA DRISHTI Backend Engine running on port: ${port}`);
  logger.log(`📚 Swagger OpenAPI Documentation available at: http://localhost:${port}/api/docs`);
  logger.log(`🩺 Health probe available at: http://localhost:${port}/health`);
  logger.log(`🚀 API Base URL: http://localhost:${port}/${apiPrefix}`);
}

void bootstrap();
