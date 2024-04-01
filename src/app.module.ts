import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegisterController } from './controllers/HubPage/register/register.controller';

@Module({
  imports: [],
  controllers: [AppController, RegisterController],
  providers: [AppService],
})
export class AppModule {}
