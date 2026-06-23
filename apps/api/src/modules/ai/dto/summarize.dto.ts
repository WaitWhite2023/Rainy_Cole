import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'

export class GenerateSummaryDto {
  @ApiProperty({
    description: '文章 Markdown 内容',
    example: 'Vite 是一个现代前端构建工具…',
  })
  @IsString()
  @MinLength(10)
  content!: string
}

export class GenerateSummaryResponseDto {
  @ApiProperty({
    description: 'AI 生成的摘要',
    example: 'Vite 利用浏览器原生 ES Module 实现极速开发体验，通过 esbuild 处理编译、Rollup 负责生产打包。',
  })
  @IsString()
  summary!: string
}
