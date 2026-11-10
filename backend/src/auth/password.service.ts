import { Injectable, Logger } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as crypto from 'crypto';

@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);

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
      // Verify only a real Argon2 hash.
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
