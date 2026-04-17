import { Injectable, NotFoundException } from '@nestjs/common';
import type { CategoryDto, CreateTaxonomyDto, UpdateTaxonomyDto } from '@rainy/shared';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CategoryDto[]> {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
  }

  async create(payload: CreateTaxonomyDto): Promise<CategoryDto> {
    return this.prisma.category.create({
      data: payload
    });
  }

  async update(id: string, payload: UpdateTaxonomyDto): Promise<CategoryDto> {
    await this.ensureExists(id);

    return this.prisma.category.update({
      where: { id },
      data: payload
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.category.delete({ where: { id } });
    return { success: true };
  }

  private async ensureExists(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category "${id}" not found`);
    }
  }
}
