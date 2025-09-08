import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
// @ts-ignore
import { ROLES_KEY } from "./roles.decorator";
import { Request } from "express";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) return true; // route không yêu cầu role => cho phép

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: { roles?: string[] } }>();
    const userRoles = request.user?.roles ?? [];
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));
    if (!hasRole)
      throw new ForbiddenException(
        "You do not have permission to access this resource",
      );

    return true;
  }
}
