import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResultadoDto } from 'src/dto/resultado.dto';
import { UsuarioCadastrarDto } from './dto/usuario.cadastrar.dto';
import { Usuario } from './usuario.entity';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private authService: AuthService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('listar')
  async listar(): Promise<Usuario[]> {
    return this.usuarioService.listar();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async obterUsuario(@Param('id') id: string): Promise<Usuario> {
    const numericId: number = parseInt(id, 10); // Parse the string to a number
    return this.usuarioService.obterPorId(numericId);
  }

  @Post('cadastrar')
  async cadastrar(@Body() data: UsuarioCadastrarDto): Promise<ResultadoDto> {
    return this.usuarioService.cadastrar(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/alterar-senha')
  async alterarSenha(
    @Param('id') id: string,
    @Body('novaSenha') novaSenha: string,
  ): Promise<ResultadoDto> {
    const numericId: number = parseInt(id, 10); // Parse the string to a number
    return this.usuarioService.alterarSenha(numericId, novaSenha);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('login-token')
  async loginToken(@Request() req, @Body() data) {
    return this.authService.loginToken(data.token);
  }
}
