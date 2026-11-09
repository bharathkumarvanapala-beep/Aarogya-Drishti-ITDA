import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';
import { RequestUser } from '../../common/decorators/current-user.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  // Strict bidirectional alias mapping between database enum RoleCodes and frontend portal codes
  private readonly ROLE_ALIASES: Record<string, string[]> = {
    // Frontline ASHA Workers
    asha: ['asha', 'ASHA_WORKER', 'health_worker'],
    ASHA_WORKER: ['asha', 'ASHA_WORKER', 'health_worker'],

    // Frontline ANM Workers
    anm: ['anm', 'ANM_WORKER'],
    ANM_WORKER: ['anm', 'ANM_WORKER'],

    // Shared health worker legacy baseline
    health_worker: ['health_worker', 'asha', 'anm', 'ASHA_WORKER', 'ANM_WORKER', 'COMMUNITY_HEALTH_OFFICER'],
    COMMUNITY_HEALTH_OFFICER: ['COMMUNITY_HEALTH_OFFICER', 'health_worker'],

    // Medical Officers & Doctors
    doctor: ['doctor', 'MEDICAL_OFFICER', 'SPECIALIST_DOCTOR', 'specialist'],
    MEDICAL_OFFICER: ['doctor', 'MEDICAL_OFFICER'],

    // Specialists
    specialist: ['specialist', 'SPECIALIST_DOCTOR', 'doctor'],
    SPECIALIST_DOCTOR: ['specialist', 'SPECIALIST_DOCTOR', 'doctor'],

    // Hospital & Lab Staff
    hospital_coordinator: ['hospital_coordinator', 'hospital', 'HOSPITAL_STAFF', 'LAB_TECHNICIAN'],
    hospital: ['hospital_coordinator', 'hospital', 'HOSPITAL_STAFF'],
    HOSPITAL_STAFF: ['hospital_coordinator', 'hospital', 'HOSPITAL_STAFF'],
    LAB_TECHNICIAN: ['hospital_coordinator', 'hospital', 'LAB_TECHNICIAN'],

    // District Administration
    admin: ['admin', 'DISTRICT_ADMIN', 'SUPER_ADMIN'],
    DISTRICT_ADMIN: ['admin', 'DISTRICT_ADMIN'],
    SUPER_ADMIN: ['admin', 'SUPER_ADMIN', 'DISTRICT_ADMIN'],

    // Patients & Community
    patient: ['patient', 'PATIENT'],
    PATIENT: ['patient', 'PATIENT'],
  };

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If endpoint has no @Roles(...) decorator, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: RequestUser & { roles?: string[] } }>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required. Missing user identity context.');
    }

    // Collect all assigned roles for the current user
    const userRoles = new Set<string>();
    if (user.role) {
      userRoles.add(user.role);
      const aliases = this.ROLE_ALIASES[user.role] || [];
      aliases.forEach((a) => userRoles.add(a));
    }
    if (Array.isArray(user.roles)) {
      user.roles.forEach((r) => {
        userRoles.add(r);
        const aliases = this.ROLE_ALIASES[r] || [];
        aliases.forEach((a) => userRoles.add(a));
      });
    }

    // Check if any required role intersects with user roles
    const hasPermission = requiredRoles.some((requiredRole) => {
      if (userRoles.has(requiredRole)) return true;
      const targetAliases = this.ROLE_ALIASES[requiredRole] || [];
      return targetAliases.some((alias) => userRoles.has(alias));
    });

    if (!hasPermission) {
      throw new ForbiddenException(
        `Access denied: insufficient role privileges. Required role: [${requiredRoles.join(', ')}] — Current role: [${user.role || 'NONE'}]`,
      );
    }

    return true;
  }
}
