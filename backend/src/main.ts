import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  const config = new DocumentBuilder()
    .setTitle('API Doc')
    .setDescription('Documentation of api endpoint')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


