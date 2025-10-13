import { Controller } from '@nestjs/common';
import { CachingService } from './caching.service';

@Controller('caching')
export class CachingController {
  constructor(private readonly cachingService: CachingService) {}
}
