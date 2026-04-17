import { Controller, Get } from '@nestjs/common';

@Controller('admin/users')
export class UsersController {
  @Get()
  findAll() {
    return [
      { id: '1', username: 'admin', nickname: '管理员', role: 'admin' },
      { id: '2', username: 'editor', nickname: '编辑', role: 'editor' }
    ];
  }
}
