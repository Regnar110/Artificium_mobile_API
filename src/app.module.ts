import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegisterController } from './controllers/HubPage/register/register.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './modules/UserModule/user.service';
import { UserModule } from './modules/UserModule/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, { dbName: 'Root' }),
    UserModule,
  ],
  controllers: [AppController, RegisterController],
  providers: [AppService],
})
export class AppModule {}
