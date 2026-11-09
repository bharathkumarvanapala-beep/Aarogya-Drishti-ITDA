import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestUser } from '../../common/decorators/current-user.decorator';

@Injectable()
export class VillageScopeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      user?: RequestUser & { roles?: string[]; assignedVillageIds?: string[] };
      params: Record<string, string>;
      query: Record<string, string>;
      body: Record<string, unknown>;
    }>();

    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('Authentication required. Missing user identity context.');
    }

    // Admins, Medical Officers, Specialists, and Hospital Staff oversee all villages in their district/catchment
    const unrestrictedRoles = new Set([
      'DISTRICT_ADMIN',
      'admin',
      'MEDICAL_OFFICER',
      'doctor',
      'SPECIALIST_DOCTOR',
      'specialist',
      'HOSPITAL_STAFF',
      'hospital_coordinator',
    ]);

    if (unrestrictedRoles.has(user.role)) {
      return true;
    }

    // Resolve all candidate target village or habitation identifiers
    const candidateTargets = [
      request.params?.villageId,
      request.params?.village,
      request.query?.villageId,
      request.query?.village,
      request.body?.villageName as string,
      request.body?.habitationVillageId as string,
      request.body?.villageId as string,
      request.body?.village as string,
      request.body?.habitation as string,
    ].filter(Boolean) as string[];

    // If no specific village is targeted, permit request
    if (candidateTargets.length === 0) {
      return true;
    }

    const assignedVillages = (user.assignedVillages || []).map((v) => v.toLowerCase().trim());
    const assignedIds = (user.assignedVillageIds || []).map((id) => id.toLowerCase().trim());

    const isAssigned = candidateTargets.some((target) => {
      const normalized = target.toLowerCase().trim();
      return assignedVillages.includes(normalized) || assignedIds.includes(normalized);
    });

    if (!isAssigned) {
      throw new ForbiddenException(
        `Village Scoping Violation: Frontline worker [${user.username}] is not assigned to tribal habitation [${candidateTargets[0]}]. Assigned habitations: [${user.assignedVillages?.join(', ') || 'NONE'}]`,
      );
    }

    return true;
  }
}
