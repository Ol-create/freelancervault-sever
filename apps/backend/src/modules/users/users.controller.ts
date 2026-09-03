import { Controller, Get } from '@nestjs/common';

@Controller('users')
export class UsersController {
  // TODO(Phase 1): GET /me, PATCH /me
  @Get()
  placeholder() {
    return { module: 'users', status: 'not implemented yet' };
  }
}
