import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AiService {
  private apiKey: string
  private baseUrl: string

  constructor(private config: ConfigService) {
    this.apiKey = this.config.get<string>('LLM_API_KEY')!
    this.baseUrl = this.config.get<string>('LLM_BASE_URL')!
  }

  async generateSummary(content: string): Promise<string> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    try {
      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-v4-flash',
          messages: [
            {
              role: 'system',
              content:
                '你是一个技术博客的摘要助手。根据给定的文章内容，生成一段中文摘要，50-100 字。要求：\n' +
                '1. 简洁概括文章核心内容\n' +
                '2. 用陈述句，不要用"本文""作者"开头\n' +
                '3. 保留关键的技术术语',
            },
            {
              role: 'user',
              content: `请为以下文章生成摘要：\n\n${content}`,
            },
          ],
          max_tokens: 500,
        }),
        signal: controller.signal,
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => '')
        throw new HttpException(
          `AI 服务调用失败（${response.status}）${errorText ? ': ' + errorText.slice(0, 200) : ''}`,
          HttpStatus.BAD_GATEWAY,
        )
      }

      const data = (await response.json()) as {
        choices: Array<{ message: { content: string } }>
      }

      const summary = data.choices?.[0]?.message?.content?.trim()
      if (!summary) {
        throw new HttpException('AI 未返回有效摘要', HttpStatus.BAD_GATEWAY)
      }

      return summary
    } catch (error) {
      if (error instanceof HttpException) throw error
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new HttpException('AI 服务响应超时，请重试', HttpStatus.GATEWAY_TIMEOUT)
      }
      throw new HttpException(
        '调用 AI 服务失败，请稍后重试',
        HttpStatus.BAD_GATEWAY,
      )
    } finally {
      clearTimeout(timeout)
    }
  }
}
