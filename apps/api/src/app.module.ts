import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TagsModule } from './modules/tags/tags.module';
import { SiteModule } from './modules/site/site.module';
import { SearchModule } from './modules/search/search.module';
import { ContentSyncModule } from './modules/content-sync/content-sync.module';
import { UploadModule } from './modules/upload/upload.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PostsModule,
    CategoriesModule,
    TagsModule,
    UploadModule,
    SiteModule,
    SearchModule,
    ContentSyncModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
