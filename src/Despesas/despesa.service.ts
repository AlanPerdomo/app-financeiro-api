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
  async remover(id: number): Promise<ResultadoDto> {
    try {
      const despesa = await this.despesaRepository.findOne({
        where: { id: id },
      });
      if (!despesa) {
        return <ResultadoDto>{
          status: false,
          message: 'Entrada não encontrada',
        };
      }
      await this.despesaRepository.remove(despesa);
      return <ResultadoDto>{
        status: true,
        message: 'Despesa removida com sucesso',
      };
    } catch (error) {
      return <ResultadoDto>{
        status: false,
        message: 'Houve um erro ao remover a entrada',
      };
    }
  }
  async removerTodosPorUsuario(id: number): Promise<ResultadoDto> {
    try {
      const despesas = await this.despesaRepository.find({
        where: { usuario: { id } },
      });

      if (despesas.length === 0) {
        return <ResultadoDto>{
          status: false,
          message: 'Nenhuma despesa encontrada para o usuário informado',
        };
      }

      await this.despesaRepository.remove(despesas);

      return <ResultadoDto>{
        status: true,
        message: 'Despesas removidas com sucesso',
      };
    } catch (error) {
      return <ResultadoDto>{
        status: false,
        message: 'Houve um erro ao remover as despesas',
      };
    }
  }

  async removerTodos(): Promise<ResultadoDto> {
    try {
      await this.despesaRepository.delete({});
      return <ResultadoDto>{
        status: true,
        message: 'Despesas removidas com sucesso',
      };
    } catch (error) {
      return <ResultadoDto>{
        status: false,
        message: 'Houve um erro ao remover as entradas',
      };
    }
  }
}
