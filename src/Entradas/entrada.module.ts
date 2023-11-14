import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TokenModule } from 'src/token/token.module';
import { DatabaseModule } from '../database/database.modules';
import { EntradaController } from './entrada.controller';
import { entradaProviders } from './entrada.providers';
import { EntradaService } from './entrada.service';

@Module({
  imports: [DatabaseModule, TokenModule],
  controllers: [EntradaController],
  providers: [...entradaProviders, EntradaService],
  exports: [EntradaService],
})
export class EntradaModule {}
