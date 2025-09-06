import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CourtsModule } from './courts/courts.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CourtsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
