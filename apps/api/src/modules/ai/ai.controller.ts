import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Roles } from '../../common/decorators/roles.decorator'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { RolesGuard } from '../../common/guards/roles.guard'
import { AiService } from './ai.service'
import { GenerateSummaryDto, GenerateSummaryResponseDto } from './dto/summarize.dto'

@ApiTags('AI')
@Controller()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('admin/ai/summarize')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @ApiOperation({ summary: 'AI 生成文章摘要' })
  @ApiBody({ type: GenerateSummaryDto })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: '摘要生成成功', type: GenerateSummaryResponseDto })
  @ApiResponse({ status: 400, description: '文章内容不足' })
  @ApiResponse({ status: 401, description: '未登录' })
  @ApiResponse({ status: 403, description: '无权限' })
  @ApiResponse({ status: 502, description: 'AI 服务调用失败' })
  async summarize(@Body() body: GenerateSummaryDto): Promise<GenerateSummaryResponseDto> {
    const summary = await this.aiService.generateSummary(body.content)
    return { summary }
  }
}
