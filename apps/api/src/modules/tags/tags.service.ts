import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateTaxonomyDto, TagDto, UpdateTaxonomyDto } from '@rainy/shared';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TagDto[]> {
    return this.prisma.tag.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async create(payload: CreateTaxonomyDto): Promise<TagDto> {
    return this.prisma.tag.create({
      data: payload
    });
  }

  async update(id: string, payload: UpdateTaxonomyDto): Promise<TagDto> {
    await this.ensureExists(id);

    return this.prisma.tag.update({
      where: { id },
      data: payload
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.tag.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      throw new NotFoundException(`Tag "${id}" not found`);
    }
  }
}
