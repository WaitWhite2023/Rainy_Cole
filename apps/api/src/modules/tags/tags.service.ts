import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
    const data = this.normalizePayload(payload);
    await this.ensureUnique(data.name, data.slug);

    return this.prisma.tag.create({
      data
    });
  }

  async update(id: string, payload: UpdateTaxonomyDto): Promise<TagDto> {
    await this.ensureExists(id);
    const data = this.normalizePayload(payload);
    await this.ensureUnique(data.name, data.slug, id);

    return this.prisma.tag.update({
      where: { id },
      data
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.$transaction([
      this.prisma.postTag.deleteMany({
        where: { tagId: id }
      }),
      this.prisma.tag.delete({ where: { id } })
    ]);
    return { success: true };
  }

  private async ensureExists(id: string) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (!tag) {
      throw new NotFoundException(`Tag "${id}" not found`);
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

    const existing = await this.prisma.tag.findFirst({
      where: {
        OR: or,
        ...(excludeId ? { NOT: { id: excludeId } } : {})
      }
    });

    if (!existing) return;

    if (name && existing.name.toLowerCase() === name.toLowerCase()) {
      throw new ConflictException(`标签名称 "${name}" 已存在`);
    }
    throw new ConflictException(`标签 slug "${slug}" 已存在`);
  }
}
