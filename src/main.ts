import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';
import { InternalServerErrorExceptionFilter } from './exceptions/internal-server-error-exception.filter';
import { UnauthorizedExceptionFilter } from './exceptions/unauthorized-exception.filter';
import { BadRequestExceptionFilter } from './exceptions/bad-request-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  /**
   * Swagger documentation
   */
  const options = new DocumentBuilder()
    .setTitle('Join A Room')
    .setDescription('Video conferencing made possible by JoinARoom Api')
    .setVersion('1.0')
    .addTag('joinaroom')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  /**
   * Handle all uncaught exceptions
   */
  app.useGlobalFilters(new InternalServerErrorExceptionFilter(), new UnauthorizedExceptionFilter(), new BadRequestExceptionFilter());

  await app.listen(3000);
}

bootstrap();
