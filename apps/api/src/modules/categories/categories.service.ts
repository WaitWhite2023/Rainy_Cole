import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
    const data = this.normalizePayload(payload);
    await this.ensureUnique(data.name, data.slug);

    return this.prisma.category.create({
      data
    });
  }

  async update(id: string, payload: UpdateTaxonomyDto): Promise<CategoryDto> {
    await this.ensureExists(id);
    const data = this.normalizePayload(payload);
    await this.ensureUnique(data.name, data.slug, id);

    return this.prisma.category.update({
      where: { id },
      data
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.$transaction([
      this.prisma.postCategory.deleteMany({
        where: { categoryId: id }
      }),
      this.prisma.category.delete({ where: { id } })
    ]);
    return { success: true };
  }

  private async ensureExists(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category "${id}" not found`);
    }
  }

  private normalizePayload<T extends Partial<CreateTaxonomyDto>>(payload: T): T {
    const next = { ...payload };
    if (typeof next.name === 'string') {
      next.name = next.name.trim().replace(/\s+/g, ' ') as T['name'];
    }
    if (typeof next.slug === 'string') {
      next.slug = next.slug.trim().toLowerCase() as T['slug'];
    }
    return next;
  }

  private async ensureUnique(name?: string, slug?: string, excludeId?: string) {
    const or = [];
    if (name) {
      or.push({ name: { equals: name, mode: 'insensitive' as const } });
    }
    if (slug) {
      or.push({ slug: { equals: slug, mode: 'insensitive' as const } });
    }
    if (!or.length) return;

    const existing = await this.prisma.category.findFirst({
      where: {
        OR: or,
        ...(excludeId ? { NOT: { id: excludeId } } : {})
      }
    });

    if (!existing) return;

    if (name && existing.name.toLowerCase() === name.toLowerCase()) {
      throw new ConflictException(`分类名称 "${name}" 已存在`);
    }
    throw new ConflictException(`分类 slug "${slug}" 已存在`);
  }
}
