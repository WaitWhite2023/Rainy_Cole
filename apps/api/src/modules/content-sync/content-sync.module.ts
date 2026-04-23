import { Module } from '@nestjs/common';
import { ContentSyncController } from './content-sync.controller';
import { SearchModule } from '../search/search.module';
import { ContentSyncService } from './content-sync.service';

@Module({
  imports: [SearchModule],
  controllers: [ContentSyncController],
  providers: [ContentSyncService]
})
export class ContentSyncModule {}
