import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, body } = request;

    return next.handle().pipe(
      tap((data) => {
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          this.auditService.log({
            userId: user?.userId,
            action: `${method} ${url}`,
            entity: this.getEntityFromUrl(url),
            entityId: data?.id || body?.id,
            metadata: {
              body,
              response: data,
              ip: request.ip,
              userAgent: request.headers['user-agent'],
            },
          });
        }
      }),
    );
  }

  private getEntityFromUrl(url: string): string {
    if (url.includes('formulations')) return 'Formulation';
    if (url.includes('auth')) return 'Auth';
    if (url.includes('ingredients')) return 'Ingredient';
    if (url.includes('approvals')) return 'Approval';
    if (url.includes('users')) return 'User';
    if (url.includes('departments')) return 'Department';
    return 'System';
  }
}
