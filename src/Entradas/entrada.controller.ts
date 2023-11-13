import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResultadoDto } from 'src/dto/resultado.dto';
import { TokenService } from 'src/token/token.service';
import { Usuario } from 'src/usuario/usuario.entity';
import { EntradaCadastrarDto } from './dto/entrada.cadastrar.dto';
import { EntradaService } from './entrada.service';
import { Entrada } from './entrada.entity';

@Controller('entrada')
export class EntradaController {
  constructor(
    private readonly entradaService: EntradaService,
    private readonly tokenService: TokenService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('cadastrar')
  async cadastrar(
    @Body() data: EntradaCadastrarDto,
    @Req() req,
  ): Promise<ResultadoDto> {
    let token = req.headers.authorization;
    let usuario: Usuario = await this.tokenService.getUsuarioByToken(token);
    if (usuario) {
      return this.entradaService.cadastrar(data, usuario);
    } else {
      throw new HttpException(
        {
          errorMessage: 'Token inválido',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('listar/:id')
  async listarEntradasUsuario(
    @Param('id') id: number,
  ): Promise<Entrada[] | undefined> {
    const entradas = await this.entradaService.listarEntradasPorUsuario(id);

    if (!entradas) {
      throw new HttpException(
        {
          errorMessage: 'Usuário não encontrado ou não possui entradas.',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return entradas;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remover/:id')
  async remover(@Param('id') id: number): Promise<ResultadoDto> {
    return this.entradaService.remover(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remover/usuario/:id')
  async removerTodosPorUsuario(@Param('id') id: number): Promise<ResultadoDto> {
    return this.entradaService.removerTodosPorUsuario(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remover')
  async removerTodos(): Promise<ResultadoDto> {
    return this.entradaService.removerTodos();
  }
}
