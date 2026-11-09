import { Body, Controller, Get, Post, Param, Headers, Module } from '@nestjs/common';
import { CurrentUser, RequestUser } from '../common/decorators/current-user.decorator';
import { CareService } from './care.service';

@Controller('care')
export class CareController {
  constructor(private readonly care: CareService) {}
  @Get('system') system(@CurrentUser() u: RequestUser) { return this.care.system(u); }
  @Post('cases/:id/call') join(@Param('id') id: string, @CurrentUser() u: RequestUser) { return this.care.join(id, u); }
  @Get('cases/:id/signals') signals(@Param('id') id: string, @CurrentUser() u: RequestUser) { return this.care.signal(id, u); }
  @Post('cases/:id/signals') signal(@Param('id') id: string, @Body() b: Record<string, unknown>, @CurrentUser() u: RequestUser) { return this.care.signal(id, u, b); }
  @Get('cases') list(@CurrentUser() u: RequestUser) { return this.care.list(u); }
  @Get('summary') summary(@CurrentUser() u: RequestUser) { return this.care.summary(u); }
  @Get('cases/:id') get(@Param('id') id: string, @CurrentUser() u: RequestUser) { return this.care.get(id, u); }
  @Post('cases') create(@Body() b: Record<string, unknown>, @Headers('x-idempotency-key') key: string, @CurrentUser() u: RequestUser) { return this.care.create(b, u, key); }
  @Post('cases/:id/actions') act(@Param('id') id: string, @Body() b: Record<string, unknown>, @CurrentUser() u: RequestUser) { return this.care.act(id, b, u); }
}
@Module({ controllers: [CareController], providers: [CareService] })
export class CareModule {}
