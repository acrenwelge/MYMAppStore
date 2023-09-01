import {Controller, Get, Post, Body, Param, Delete, UseGuards, Request, HttpCode} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionDto } from './subscription.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @HttpCode(200)
  @Post()
  create(@Body() newSubscription: SubscriptionDto) {
    return this.subscriptionService.create(newSubscription);
  }

  @UseGuards(JwtAuthGuard)
  @Get('record')
  findAll(@Request() req) {
    return this.subscriptionService.findAllForUser(req.user.user_id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.subscriptionService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.subscriptionService.remove(id);
  }
}
