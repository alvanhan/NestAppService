import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  checkAPI(): string {
    return 'NestJS Backend API';
  }
}
