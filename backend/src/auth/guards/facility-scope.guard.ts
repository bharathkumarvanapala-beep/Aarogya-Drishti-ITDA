import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestUser } from '../../common/decorators/current-user.decorator';

@Injectable()
export class FacilityScopeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      user?: RequestUser & { roles?: string[] };
      params: Record<string, string>;
      query: Record<string, string>;
      body: Record<string, unknown>;
    }>();

    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('Authentication required. Missing user identity context.');
    }

    // District Admin has district-wide facility access across all PHCs and Hospitals
    if (user.role === 'DISTRICT_ADMIN' || user.role === 'admin') {
      return true;
    }

    // Resolve target facility ID from params, query, or payload
    const targetFacilityId =
      request.params?.facilityId ||
      request.query?.facilityId ||
      (request.body?.facilityId as string) ||
      (request.body?.sourceFacilityId as string);

    // If request does not target a specific foreign facility, permit execution
    if (!targetFacilityId) {
      return true;
    }

    // Frontline health workers and clinicians are scoped strictly to their assigned facility
    if (!user.facilityId || user.facilityId !== targetFacilityId) {
      throw new ForbiddenException(
        `Facility Scoping Violation: User [${user.username}] assigned to facility [${user.facilityId || 'UNASSIGNED'}] cannot access or modify records of facility [${targetFacilityId}].`,
      );
    }

    return true;
  }
}
