import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
	const logger = new Logger('MyMathAppServer'); // create a new logger instance
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: ["http://localhost:3000", "https://dev3.mymathapps.com","https://my-math-apps-online-textbook-63eb858df6f6.herokuapp.com"],
	});
	app.setGlobalPrefix('api');
	const swaggerConfig = new DocumentBuilder()
		.setTitle('MYMathApps Store API')
		.setDescription('REST API Endpoints for MYMathApps Store client')
		.setVersion('1.0')
		.build();
	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('docs', app, document);

	const configService = app.get(ConfigService);

	await app.listen(process.env.PORT || configService.get<string>('SERVER_PORT'),()=>{
		logger.log('Ready to listen port ' + configService.get<string>('SERVER_PORT'))
		logger.log('MyMathApp Server Application started');
		logger.log('MyMathApp Server running at ' + configService.get<string>('ENV_TYPE') + ' Mode')
	});
}
bootstrap();