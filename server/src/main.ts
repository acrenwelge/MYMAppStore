import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
async function bootstrap() {
  const logger = new Logger('MyMathAppServer'); // create a new logger instance

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ["http://localhost:3000", "https://dev3.mymathapps.com","https://mymathapp2023spring.herokuapp.com/"],
  });
  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);

  await app.listen(process.env.PORT || configService.get<string>('SERVER_PORT'),()=>{
    logger.log('Ready to listen port ' + configService.get<string>('SERVER_PORT'))
    logger.log('MyMathApp Server Application started'); // log a message using the logger instance
    logger.log('MyMathApp Server running at ' + configService.get<string>('ENV_TYPE') + ' Mode')
  });
}
bootstrap();
