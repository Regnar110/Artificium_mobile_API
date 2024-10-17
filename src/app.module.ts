import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule2 } from './lgcy/components/UserComponent/modules/user.module';
import { JwtModule } from '@nestjs/jwt';
import { SocketFriendListModule } from './lgcy/components/SocketFriendListComponent/socket.module';
import { SocketChatModule } from './lgcy/components/SocketChatComponent/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    JwtModule.register({
      global: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, { dbName: 'Artificium' }),
    UserModule2,
    SocketFriendListModule,
    SocketChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
