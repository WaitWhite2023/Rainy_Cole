import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/common/utils/password.util';

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { code: 'admin' },
    update: { name: '管理员' },
    create: {
      code: 'admin',
      name: '管理员'
    }
  });

  const editorRole = await prisma.role.upsert({
    where: { code: 'editor' },
    update: { name: '编辑' },
    create: {
      code: 'editor',
      name: '编辑'
    }
  });

  const passwordHash = await hashPassword('123456');

  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      nickname: '管理员',
      passwordHash,
      roleId: adminRole.id
    },
    create: {
      username: 'admin',
      nickname: '管理员',
      passwordHash,
      roleId: adminRole.id
    }
  });

  await prisma.user.upsert({
    where: { username: 'editor' },
    update: {
      nickname: '编辑',
      passwordHash,
      roleId: editorRole.id
    },
    create: {
      username: 'editor',
      nickname: '编辑',
      passwordHash,
      roleId: editorRole.id
    }
  });

  const category = await prisma.category.upsert({
    where: { slug: 'announcement' },
    update: { name: '公告' },
    create: {
      name: '公告',
      slug: 'announcement'
    }
  });

  const tag = await prisma.tag.upsert({
    where: { slug: 'init' },
    update: { name: '初始化' },
    create: {
      name: '初始化',
      slug: 'init'
    }
  });

  await prisma.siteSetting.upsert({
    where: { id: 'site-setting-default' },
    update: {
      siteName: 'Rainy Cole',
      subtitle: '记录代码、生活与长期主义',
      aboutContent: '这是一个从 0 到 1 搭建的个人博客项目。',
      seoDefaultTitle: 'Rainy Cole Blog',
      seoDefaultDescription: '个人博客站点首版'
    },
    create: {
      id: 'site-setting-default',
      siteName: 'Rainy Cole',
      subtitle: '记录代码、生活与长期主义',
      aboutContent: '这是一个从 0 到 1 搭建的个人博客项目。',
      seoDefaultTitle: 'Rainy Cole Blog',
      seoDefaultDescription: '个人博客站点首版',
      socialLinks: [
        { name: 'GitHub', url: 'https://github.com/example' }
      ]
    }
  });

  const existingPost = await prisma.post.findUnique({
    where: { slug: 'welcome-to-rainy-cole' }
  });

  if (!existingPost) {
    await prisma.post.create({
      data: {
        title: '欢迎来到 Rainy Cole',
        slug: 'welcome-to-rainy-cole',
        summary: '这是项目初始化后的示例文章。',
        content: '这篇文章用于联通前后台、数据库和后端服务的基本链路。',
        status: 'PUBLISHED',
        sourceType: 'DATABASE',
        contentType: 'markdown',
        publishedAt: new Date(),
        authorId: adminUser.id,
        tags: {
          create: [{ tagId: tag.id }]
        },
        categories: {
          create: [{ categoryId: category.id }]
        }
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
