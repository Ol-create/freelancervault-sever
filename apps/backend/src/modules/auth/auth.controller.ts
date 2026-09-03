import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  // TODO(Phase 1): POST /register, POST /login, POST /refresh, POST /logout
  @Get()
  placeholder() {
    return { module: 'auth', status: 'not implemented yet' };
  }
}
