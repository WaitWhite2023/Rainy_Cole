import { Controller, Get } from '@nestjs/common';

@Controller('admin/roles')
export class RolesController {
  @Get()
  findAll() {
    return [
      { code: 'admin', name: '管理员' },
      { code: 'editor', name: '编辑' }
    ];
  }
}
