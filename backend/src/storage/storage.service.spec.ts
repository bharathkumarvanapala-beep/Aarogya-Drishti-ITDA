import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';

describe('Backend Unit Test: StorageService', () => {
  let service: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string) => {
              if (key === 's3') {
                return {
                  bucket: 'aarogya-clinical-images',
                  endpoint: 'http://localhost:9000',
                  region: 'ap-south-1',
                };
              }
              return null;
            },
          },
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Magic Bytes Binary Signature Inspection', () => {
    it('should validate genuine JPEG binary headers (FF D8 FF)', () => {
      const buffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
      const result = service.validateMagicBytes(buffer);
      expect(result.isValid).toBe(true);
      expect(result.detectedMime).toBe('image/jpeg');
    });

    it('should validate genuine PNG binary headers (89 50 4E 47)', () => {
      const buffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      const result = service.validateMagicBytes(buffer);
      expect(result.isValid).toBe(true);
      expect(result.detectedMime).toBe('image/png');
    });

    it('should reject Windows PE/MZ executable binaries', () => {
      const buffer = Buffer.from([0x4d, 0x5a, 0x90, 0x00]);
      const result = service.validateMagicBytes(buffer);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Windows executable');
    });

    it('should reject Linux ELF binary executables', () => {
      const buffer = Buffer.from([0x7f, 0x45, 0x4c, 0x46]);
      const result = service.validateMagicBytes(buffer);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Linux ELF');
    });

    it('should reject spoofed HTML or script files', () => {
      const buffer = Buffer.from('<!DOCTYPE html><html><body>malicious</body></html>');
      const result = service.validateMagicBytes(buffer);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Script or HTML');
    });
  });

  describe('Randomized UUID Object Key Generation', () => {
    it('should generate object key matching screenings/{id}/{view}_{uuid}.jpg', () => {
      const key = service.generateObjectKey('scr-1234', 'RIGHT_CHEEK', 'jpg');
      expect(key).toMatch(/^screenings\/scr-1234\/right_cheek_[a-f0-9-]+\.jpg$/);
    });
  });
});
