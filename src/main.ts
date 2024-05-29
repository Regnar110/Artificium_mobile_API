import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { redisConfig } from './services/Redis/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: redisConfig(),
  });
  await app.listen(process.env.PORT);
  console.log(`Nest server is running on: ${process.env.PORT}`);
}
bootstrap();
