import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { redisConfig } from './shared/services/redis/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: redisConfig(),
  });
  await app.listen(process.env.PORT);
  console.log(`Nest server is running on: ${process.env.PORT}`);
}
bootstrap();
