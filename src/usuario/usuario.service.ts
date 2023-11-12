import { Injectable, Inject } from '@nestjs/common';
import { ResultadoDto } from 'src/dto/resultado.dto';
import { Repository } from 'typeorm';
import { UsuarioCadastrarDto } from './dto/usuario.cadastrar.dto';
import { Usuario } from './usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @Inject('USUARIO_REPOSITORY')
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async listar(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }

  async cadastrar(data: UsuarioCadastrarDto): Promise<ResultadoDto> {
    const email = await this.usuarioRepository.findOne({
      where: { email: data.email },
    });
    const cpf = await this.usuarioRepository.findOne({
      where: { cpf: data.cpf },
    });
    if (email) {
      return <ResultadoDto>{
        status: false,
        message: 'Email já existe',
      };
    }
    if (cpf) {
      return <ResultadoDto>{
        status: false,
        message: 'CPF já existe',
      };
    }

    let usuario = new Usuario();
    usuario.email = data.email;
    usuario.nome = data.nome;
    usuario.password = bcrypt.hashSync(data.senha, 8);
    usuario.telefone = data.telefone;
    usuario.cpf = data.cpf;

    return this.usuarioRepository
      .save(usuario)
      .then((result) => {
        return <ResultadoDto>{
          status: true,
          message: 'Usuário cadastrado com sucesso',
        };
      })
      .catch((error) => {
        return <ResultadoDto>{
          status: false,
          message: 'Houve um errro ao cadastrar o usuário',
        };
      });
  }

  async findOne(email: string): Promise<Usuario | undefined> {
    return this.usuarioRepository.findOne({ where: { email: email } });
  }

  async obterPorId(id: number): Promise<Usuario | undefined> {
    return this.usuarioRepository.findOne({ where: { id: id } });
  }

  async deletar(id: number): Promise<ResultadoDto> {
    try {
      const usuario = await this.usuarioRepository.findOne({
        where: { id: id },
      });
      if (!usuario) {
        return { message: 'Usuario nao encontrado', status: false };
      }
      await this.usuarioRepository.remove(usuario);
      return { message: 'Usuario deletado com sucesso', status: true };
    } catch (error) {
      return { message: 'Houve um erro ao deletar o usuario', status: false };
    }
  }

  async atualizarUsuario(
    id: number,
    data: Partial<Usuario>,
  ): Promise<ResultadoDto> {
    try {
      const usuario = await this.usuarioRepository.findOne({
        where: { id: id },
      });
      if (!usuario) {
        return { message: 'Usuario nao encontrado', status: false };
      }
      if (data.nome) {
        usuario.nome = data.nome;
      }
      if (data.telefone) {
        usuario.telefone = data.telefone;
      }
      if (data.email) {
        usuario.email = data.email;
      }
      await this.usuarioRepository.save(usuario);
      return { message: 'Usuario atualizado com sucesso', status: true };
    } catch (error) {
      return { message: 'Houve um erro ao atualizar o usuario', status: false };
    }
  }

  async alterarSenha(id: number, novaSenha: string): Promise<ResultadoDto> {
    try {
      const usuario = await this.usuarioRepository.findOne({
        where: { id: id },
      });
      if (!usuario) {
        return <ResultadoDto>{
          status: false,
          message: 'Houve um erro ao alterar a senha',
        };
      }
      usuario.password = bcrypt.hashSync(novaSenha, 8);
      await this.usuarioRepository.save(usuario);
      return <ResultadoDto>{
        status: true,
        message: 'Senha alterada com sucesso',
      };
    } catch (error) {
      return <ResultadoDto>{
        status: false,
        message: 'Houve um erro ao alterar a senha',
      };
    }
  }
}
