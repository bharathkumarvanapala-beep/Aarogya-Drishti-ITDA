export interface AppConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  corsOrigin: string;
  database: {
    url: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  s3: {
    endpoint: string;
    region: string;
    bucket: string;
    accessKey: string;
    secretKey: string;
    forcePathStyle: boolean;
  };
  opencvServiceUrl: string;
  aiResearchServiceUrl: string;
  throttle: {
    ttl: number;
    limit: number;
  };
}

export default (): AppConfig => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  database: {
    url: process.env.DATABASE_URL || 'postgresql://aarogya:aarogya_secret@localhost:5432/aarogya_drishti_db?schema=public',
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  s3: {
    endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
    region: process.env.S3_REGION || 'ap-south-1',
    bucket: process.env.S3_BUCKET || 'aarogya-clinical-images',
    accessKey: process.env.S3_ACCESS_KEY || 'minioadmin',
    secretKey: process.env.S3_SECRET_KEY || 'minioadmin',
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
  },
  opencvServiceUrl: process.env.OPENCV_SERVICE_URL || 'http://localhost:8001',
  aiResearchServiceUrl: process.env.AI_RESEARCH_SERVICE_URL || 'http://localhost:8002',
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT || '120', 10),
  },
});
