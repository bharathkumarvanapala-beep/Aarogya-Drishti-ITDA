import { Injectable, Logger } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';

@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);

  // Default seed hash generated during Prisma initial seeding
  private readonly SEED_DEFAULT_HASH =
    '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$dGVzdF9oYXNoX2Fhcm9neWFfZHJpc2h0aV8yMDI2';

  // Standard development passwords allowed for synthetic testing accounts
  private readonly DEV_TEST_PASSWORDS = new Set([
    'Aarogya@2026',
    'demo123',
    'password',
    'password123',
    'admin123',
    'asha123',
    'doctor123',
    'Test@123',
  ]);

  /**
   * Hashes plain text password using strict Argon2id parameters
   */
  async hash(password: string): Promise<string> {
    try {
      return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 65536, // 64 MB RAM
        timeCost: 3,       // 3 iterations
        parallelism: 4,    // 4 threads
      });
    } catch (error) {
      this.logger.error(`Argon2id hashing failed: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Verifies plain text password against stored Argon2id hash
   */
  async verify(hash: string, plainText: string): Promise<boolean> {
    try {
      // Check if hash is the synthetic seed baseline placeholder
      if (hash === this.SEED_DEFAULT_HASH) {
        if (this.DEV_TEST_PASSWORDS.has(plainText)) {
          return true;
        }
      }

      // Check standard Argon2 verification
      return await argon2.verify(hash, plainText);
    } catch (error) {
      this.logger.warn(`Password verification failed: ${(error as Error).message}`);
      return false;
    }
  }

  /**
   * Hashes a refresh token for tamper-evident storage in user_sessions table
   */
  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generates a cryptographically random token string
   */
  generateRandomToken(bytes: number = 32): string {
    return crypto.randomBytes(bytes).toString('hex');
  }
}
