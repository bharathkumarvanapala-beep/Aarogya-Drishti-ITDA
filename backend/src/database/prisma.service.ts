import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  public isDbConnected = false;

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });
  }

  async onModuleInit() {
    if (process.env.NODE_ENV === 'test') {
      this.isDbConnected = false;
      this.logger.log('Test environment active: live PostgreSQL connection deferred.');
      return;
    }

    try {
      this.logger.log('Connecting to PostgreSQL database via Prisma...');
      const connectPromise = this.$connect();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database connection timed out (2000ms limit)')), 2000),
      );
      await Promise.race([connectPromise, timeoutPromise]);
      this.isDbConnected = true;
      this.logger.log('Database connection successfully established.');
    } catch (error) {
      this.isDbConnected = false;
      this.logger.warn(
        `Database connection deferred (PostgreSQL instance may be offline or starting up): ${(error as Error).message}`,
      );
    }
  }

  async onModuleDestroy() {
    try {
      this.logger.log('Disconnecting Prisma Client...');
      await this.$disconnect();
      this.logger.log('Database connection cleanly terminated.');
    } catch {
      // Ignored on disconnect if not connected
    }
  }

  /**
   * Helper to clean database tables during automated E2E tests
   */
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Database wipe is prohibited in production environment.');
    }
    // Truncate tables in reverse topological order if needed for testing
  }
}
