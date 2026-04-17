import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      name: 'rainy-cole-api',
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  }
}
