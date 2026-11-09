import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ImageQualityService } from './quality.service';
import { PrismaService } from '../database/prisma.service';

describe('Backend Unit Test: ImageQualityService', () => {
  let service: ImageQualityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageQualityService,
        {
          provide: PrismaService,
          useValue: {
            isDbConnected: false,
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: () => 'http://localhost:8001',
          },
        },
      ],
    }).compile();

    service = module.get<ImageQualityService>(ImageQualityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should flag blurry image with RECAPTURE_REQUIRED and bilingual advice', async () => {
    const result = await service.assessQuality('test-img-01', {
      filename: 'blurry_unfocused_tongue.jpg',
    });

    expect(result.verdict).toBe('RECAPTURE_REQUIRED');
    expect(result.sharpnessScore).toBeLessThan(100);
    expect(result.automatedFeedbackEn).toContain('blurry');
    expect(result.automatedFeedbackTe).toContain('మసకగా');
  });

  it('should flag underexposed dark oral cavity', async () => {
    const result = await service.assessQuality('test-img-02', {
      filename: 'dark_dim_lighting.jpg',
    });

    expect(result.verdict).toBe('RECAPTURE_REQUIRED');
    expect(result.brightnessScore).toBeLessThan(45);
    expect(result.automatedFeedbackEn).toContain('dark');
    expect(result.automatedFeedbackTe).toContain('టార్చ్ లైట్');
  });

  it('should approve well-lit clear mucosal image as ACCEPTABLE', async () => {
    const result = await service.assessQuality('test-img-03', {
      filename: 'clear_well_lit_buccal.jpg',
    });

    expect(result.verdict).toBe('ACCEPTABLE');
    expect(result.sharpnessScore).toBeGreaterThanOrEqual(100);
    expect(result.brightnessScore).toBeGreaterThanOrEqual(45);
    expect(result.automatedFeedbackEn).toContain('acceptable');
    expect(result.automatedFeedbackTe).toContain('ఆమోదయోగ్యంగా');
  });
});
