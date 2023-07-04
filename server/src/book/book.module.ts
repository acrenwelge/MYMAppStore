import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import {RecordModule} from "../record/record.module";
import {EmailSubscriptionModule} from "../email-subscription/email-subscription.module";
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[RecordModule,EmailSubscriptionModule, UserModule],
  controllers: [BookController],
  providers: [BookService]
})
export class BookModule {}
