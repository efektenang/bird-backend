import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY, Role } from "./roles.decorator";
import { Request } from "@utilities/helper-type.util";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(req);

    return requiredRoles.some((role) => token?.includes(role));
  }

  private extractTokenFromHeader(request: Request): any {
    const type = request.user_auth.type;

    return type;
  }
}
