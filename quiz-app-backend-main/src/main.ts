import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))

    // This is to enable any host to come from any host
    app.enableCors({
      origin: true
    })
  
    const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API documentation for quiz app backend')
    .setVersion('1.0')
    .addBearerAuth() // Add this if your app uses JWT for auth
    .build();
  
  // Create Swagger document
  const document = SwaggerModule.createDocument(app, config);
  
  // Set up Swagger at /api endpoint
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

