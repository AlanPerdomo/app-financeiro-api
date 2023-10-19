import { Injectable, Inject } from '@nestjs/common';
import { ResultadoDto } from 'src/dto/resultado.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Entrada } from './entrada.entity';
import { EntradaCadastrarDto } from './dto/entrada.cadastrar.dto';
import { Usuario } from 'src/usuario/usuario.entity';

@Injectable()
export class EntradaService {
  constructor(
    @Inject('ENTRADA_REPOSITORY')
    private entradaRepository: Repository<Entrada>,
  ) {}

  async cadastrar(
    data: EntradaCadastrarDto,
    usuario: Usuario,
  ): Promise<ResultadoDto> {
    let entrada = new Entrada();
    entrada.titulo = data.titulo;
    entrada.descricao = data.descricao;
    entrada.valor = data.valor;
    entrada.data = data.data;
    entrada.hora = data.hora;
    entrada.tipo = data.tipo;
    entrada.usuario = usuario;
    return this.entradaRepository
      .save(entrada)
      .then(() => {
        return <ResultadoDto>{
          status: true,
          message: 'Entrada cadastrada com sucesso',
        };
      })
      .catch(() => {
        return <ResultadoDto>{
          status: false,
          message: 'Houve um erro ao cadastrar a entrada',
        };
      });
  }
}
