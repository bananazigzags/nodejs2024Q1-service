import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import * as swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as YAML from 'yaml';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const file = fs.readFileSync('./doc/api.yaml', 'utf8');
  const swaggerDocument = YAML.parse(file);

  app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
