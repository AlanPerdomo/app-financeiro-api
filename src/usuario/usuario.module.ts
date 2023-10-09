import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.modules';
import { usuarioProviders } from './usuario.providers';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UsuarioController],
  providers: [...usuarioProviders, UsuarioService],
})
export class UsuarioModule {}