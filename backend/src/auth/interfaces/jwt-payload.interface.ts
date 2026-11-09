export interface JwtPayload {
  sub: string; // UserAccount UUID
  username: string;
  roles: string[];
  primaryRole: string;
  facilityId?: string;
  assignedVillages?: string[];
  assignedVillageIds?: string[];
  sessionId?: string;
  isMfaPending?: boolean;
  iat?: number;
  exp?: number;
}
