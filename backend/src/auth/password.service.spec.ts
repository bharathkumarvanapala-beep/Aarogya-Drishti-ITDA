import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';

describe('Backend Unit Test: PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash and verify passwords using Argon2id', async () => {
    const rawPassword = 'Aarogya@SecurePassword2026';
    const hash = await service.hash(rawPassword);

    expect(hash).toBeDefined();
    expect(hash.startsWith('$argon2id$')).toBe(true);

    const isMatch = await service.verify(hash, rawPassword);
    expect(isMatch).toBe(true);

    const isWrongMatch = await service.verify(hash, 'WrongPassword@123');
    expect(isWrongMatch).toBe(false);
  });

  it('should generate deterministic SHA-256 token hashes for session security', () => {
    const token = 'session_token_xyz_12345';
    const hash1 = service.hashToken(token);
    const hash2 = service.hashToken(token);

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64); // SHA-256 hex length
  });
});
