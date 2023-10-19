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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ResultadoDto } from 'src/dto/resultado.dto';
import { TokenService } from 'src/token/token.service';
import { Usuario } from 'src/usuario/usuario.entity';
import { DespesaCadastrarDto } from './dto/despesa.cadastrar.dto';
import { DespesaService } from './despesa.service';

@Controller('despesa')
export class DespesaController {
  constructor(
    private readonly despesaService: DespesaService,
    private readonly tokenService: TokenService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('cadastrar')
  async cadastrar(
    @Body() data: DespesaCadastrarDto,
    @Req() req,
  ): Promise<ResultadoDto> {
    let token = req.headers.authorization;
    let usuario: Usuario = await this.tokenService.getUsuarioByToken(token);
    if (usuario) {
      return this.despesaService.cadastrar(data, usuario);
    } else {
      throw new HttpException(
        {
          errorMessage: 'Token inválido',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
