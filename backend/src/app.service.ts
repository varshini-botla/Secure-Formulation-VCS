import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Secure Formulation VCS API v1.0 Operational';
  }
}
