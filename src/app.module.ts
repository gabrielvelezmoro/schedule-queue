import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestController } from './test/test.controller';
import { DatabaseService } from './database/database.service';
import { TweetsModule } from './tweets/tweets.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { join } from 'path';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite',
      host: join('database.sqlite'),
      autoLoadModels: true,
      synchronize: true,
    }),
    TweetsModule,
  ],
  controllers: [AppController, TestController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
