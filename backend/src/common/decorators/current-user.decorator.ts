import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface RequestUser {
  id: string;
  username: string;
  role: string;
  roles?: string[];
  facilityId?: string;
  assignedVillages?: string[];
  assignedVillageIds?: string[];
}

export const CurrentUser = createParamDecorator(
  (data: keyof RequestUser | undefined, ctx: ExecutionContext): unknown => {
    const request = ctx.switchToHttp().getRequest<{ user?: RequestUser }>();
    const user = request.user;
    if (!user) return null;
    return data ? user[data] : user;
  },
);
