import { Module } from '@nestjs/common';
import { ContentSyncController } from './content-sync.controller';

@Module({
  controllers: [ContentSyncController]
})
export class ContentSyncModule {}
