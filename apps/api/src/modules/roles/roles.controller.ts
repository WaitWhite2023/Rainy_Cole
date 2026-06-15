import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('admin/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Returns role list' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll() {
    return this.rolesService.findAll();
  }
}
