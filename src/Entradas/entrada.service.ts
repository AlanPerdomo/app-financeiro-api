import { Injectable, Inject } from '@nestjs/common';
import { ResultadoDto } from 'src/dto/resultado.dto';
import { Repository } from 'typeorm';
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
    entrada.titulo = data.titulo || '';
    entrada.descricao = data.descricao || '';
    entrada.valor = data.valor;
    entrada.data = data.data
      ? data.data.toISOString()
      : new Date().toISOString();
    entrada.tipo = data.tipo || '';
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
  async listarEntradasPorUsuario(usuarioId: number): Promise<Entrada[]> {
    try {
      const entradas = await this.entradaRepository
        .createQueryBuilder('entrada')
        .where('entrada.usuarioId =:usuarioId', { usuarioId })
        .getMany();
      return entradas;
    } catch (error) {
      console.error('erro ao buscar entradas por usuario', error);
      throw error;
    }
  }

  async remover(id: number): Promise<ResultadoDto> {
    try {
      const entrada = await this.entradaRepository.findOne({
        where: { id: id },
      });
      if (!entrada) {
        return <ResultadoDto>{
          status: false,
          message: 'Entrada não encontrada',
        };
      }
      await this.entradaRepository.remove(entrada);
      return <ResultadoDto>{
        status: true,
        message: 'Entrada removida com sucesso',
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
      const entradas = await this.entradaRepository.find({
        where: { usuario: { id } },
      });

      if (entradas.length === 0) {
        return <ResultadoDto>{
          status: false,
          message: 'Nenhuma entrada encontrada para o usuário informado',
        };
      }

      await this.entradaRepository.remove(entradas);

      return <ResultadoDto>{
        status: true,
        message: 'entradas removidas com sucesso',
      };
    } catch (error) {
      return <ResultadoDto>{
        status: false,
        message: 'Houve um erro ao remover as entradas',
      };
    }
  }
  async removerTodos(): Promise<ResultadoDto> {
    try {
      await this.entradaRepository.delete({});
      return <ResultadoDto>{
        status: true,
        message: 'Entradas removidas com sucesso',
      };
    } catch (error) {
      return <ResultadoDto>{
        status: false,
        message: 'Houve um erro ao remover as entradas',
      };
    }
  }
}
