import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname, join } from 'path';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';

const uploadDir = process.env.UPLOAD_DIR || './apps/api/uploads';

mkdirSync(uploadDir, { recursive: true });

@Controller('admin/upload')
export class UploadController {
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'editor')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_request: unknown, _file: unknown, callback: (error: Error | null, destination: string) => void) => {
          callback(null, uploadDir);
        },
        filename: (
          _request: unknown,
          file: { originalname: string },
          callback: (error: Error | null, filename: string) => void
        ) => {
          const extension = extname(file.originalname);
          callback(null, `${Date.now()}-${randomUUID()}${extension}`);
        }
      })
    })
  )
  upload(
    @UploadedFile()
    file?: {
      filename: string;
      originalname: string;
      mimetype: string;
      size: number;
    }
  ) {
    return {
      message: 'Upload success',
      uploadDir,
      fileName: file?.filename,
      originalName: file?.originalname,
      mimeType: file?.mimetype,
      size: file?.size,
      url: file ? `/uploads/${file.filename}` : null,
      absolutePath: file ? join(uploadDir, file.filename) : null
    };
  }
}
