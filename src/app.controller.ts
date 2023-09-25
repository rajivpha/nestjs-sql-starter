import { ApiOperation } from '@nestjs/swagger';
import { Controller, Get, VERSION_NEUTRAL, Version } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Version(VERSION_NEUTRAL)
  @ApiOperation({
    summary: 'ping service',
  })
  @Get('')
  root(): string {
    return this.appService.getHello();
  }
}
