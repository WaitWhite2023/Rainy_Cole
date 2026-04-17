import { Controller, Post } from '@nestjs/common';

@Controller('admin/upload')
export class UploadController {
  @Post()
  upload() {
    return {
      message: 'Upload endpoint placeholder',
      uploadDir: process.env.UPLOAD_DIR || './uploads'
    };
  }
}
