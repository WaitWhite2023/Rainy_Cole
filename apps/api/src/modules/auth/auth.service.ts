import { Injectable } from '@nestjs/common';
import type { LoginDto } from '@rainy/shared';

@Injectable()
export class AuthService {
  login(payload: LoginDto) {
    return {
      accessToken: `mock-access-for-${payload.username}`,
      refreshToken: `mock-refresh-for-${payload.username}`,
      user: {
        username: payload.username,
        role: 'admin'
      }
    };
  }
}
