import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import {SubscriptionModule} from "../subscription/subscription.module";
import {FreeSubscriptionModule} from "../free-subscription/free-subscription.module";
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[SubscriptionModule,FreeSubscriptionModule, UserModule],
  controllers: [BookController],
  providers: [BookService]
})
export class BookModule {}
