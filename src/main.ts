import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TranformInterceptor } from './transform.interceptor';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TranformInterceptor());
  app.enableCors();
  app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  app.use(bodyParser.json({ limit: '50mb' }));
  const port = process.env.PORT || 5000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
