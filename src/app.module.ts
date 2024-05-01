import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/UserModule/user.module';
import { UserController } from './modules/UserModule/controller/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, { dbName: 'Artificium' }),
    UserModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
