import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';
import { UsuarioCadastrarDto } from './dto/usuario.cadastrar.dto';
import { ResultadoDto } from 'src/dto/resultado.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Get('listar')
  async listar(): Promise<Usuario[]> {
    return await this.usuarioService.listar();
  }
  @Post('cadastrar')
  async cadastrar(@Body() data: UsuarioCadastrarDto): Promise<ResultadoDto> {
    return this.usuarioService.cadastrar(data);
  }
}
