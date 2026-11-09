import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException, ServiceUnavailableException } from '@nestjs/common';
import { AiResearchService } from './ai-research.service';
import { PrismaService } from '../database/prisma.service';

describe('Backend Unit Test: AiResearchService', () => {
  let service: AiResearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiResearchService,
        {
          provide: PrismaService,
          useValue: {
            isDbConnected: false,
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: () => 'http://localhost:8002',
          },
        },
      ],
    }).compile();

    service = module.get<AiResearchService>(AiResearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('STRICT SAFETY BOUNDARY: should permanently enforce score: null on research demo output', async () => {
    const result = await service.runDemonstrationAnalysis('test-img-rc', 'RIGHT_CHEEK', true);

    expect(result.score).toBeNull();
    expect(result.isNonClinicalDemo).toBe(true);
    expect(result.categoricalLabel).toBe('suspicious_example');
    expect(result.safetyDisclaimer).toContain('STRICTLY NON-CLINICAL');
    expect(result.safetyDisclaimer).toContain('Not for diagnosis');
  });

  it('should reject AI demo if non-clinical research consent is false', async () => {
    await expect(
      service.runDemonstrationAnalysis('test-img-rc', 'RIGHT_CHEEK', false),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should throw ServiceUnavailableException when AI service is toggled offline', async () => {
    service.setAiServiceEnabled(false);

    await expect(
      service.runDemonstrationAnalysis('test-img-rc', 'RIGHT_CHEEK', true),
    ).rejects.toThrow(ServiceUnavailableException);

    // Re-enable
    service.setAiServiceEnabled(true);
  });
});
