import { Injectable, Inject } from '@nestjs/common';
import { ResultadoDto } from 'src/dto/resultado.dto';
import { Repository } from 'typeorm';
import { Despesa } from './despesa.entity';
import { DespesaCadastrarDto } from './dto/despesa.cadastrar.dto';
import { Usuario } from 'src/usuario/usuario.entity';

@Injectable()
export class DespesaService {
  constructor(
    @Inject('DESPESA_REPOSITORY')
    private despesaRepository: Repository<Despesa>,
  ) {}

  async cadastrar(
    data: DespesaCadastrarDto,
    usuario: Usuario,
  ): Promise<ResultadoDto> {
    let despesa = new Despesa();
    despesa.titulo = data.titulo || '';
    despesa.descricao = data.descricao || '';
    despesa.valor = data.valor;
    despesa.data = data.data
      ? data.data.toISOString()
      : new Date().toISOString();
    despesa.tipo = data.tipo || '';
    despesa.usuario = usuario;
    return this.despesaRepository
      .save(despesa)
      .then(() => {
        return <ResultadoDto>{
          status: true,
          message: 'despesa cadastrada com sucesso',
        };
      })
      .catch(() => {
        return <ResultadoDto>{
          status: false,
          message: 'Houve um erro ao cadastrar a despesa',
        };
      });
  }
  async listarDespesasPorUsuario(usuarioId: number): Promise<Despesa[]> {
    try {
      const despesas = await this.despesaRepository
        .createQueryBuilder('despesa')
        .where('despesa.usuarioId =:usuarioId', { usuarioId })
        .getMany();
      return despesas;
    } catch (error) {
      console.error('erro ao buscar despesas por usuario', error);
      throw error;
    }
  }
}
