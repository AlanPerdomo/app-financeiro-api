import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { TokenModule } from 'src/token/token.module';
import { DatabaseModule } from '../database/database.modules';
import { DespesaController } from './despesa.controller';
import { despesaProviders } from './despesa.providers';
import { DespesaService } from './despesa.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => TokenModule)],
  controllers: [DespesaController],
  providers: [...despesaProviders, DespesaService],
  exports: [DespesaService],
})
export class DespesaModule {}
