import {Controller, Get, Post, Body, Param, Delete, UseGuards, Request, HttpCode, HttpStatus} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionDto } from './subscription.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() newSubscription: SubscriptionDto) {
    return this.subscriptionService.create(newSubscription);
  }

  @UseGuards(JwtAuthGuard)
  @Get("all")
  findAll() {
    return this.subscriptionService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAllForUser(@Request() req) {
    return this.subscriptionService.findAllForOwner(req.user.user_id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.subscriptionService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number) {
    this.subscriptionService.remove(id);
  }
}
