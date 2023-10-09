import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { UsuarioCadastrarDto } from './dto/usuario.cadastrar.dto';
import { ResultadoDto } from 'src/dto/resultado.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @Inject('USUARIO_REPOSITORY')
    private usuarioRepository: Repository<Usuario>,
  ) {}
  async listar(): Promise<Usuario[]> {
    return await this.usuarioRepository.find();
  }

  async cadastrar(data: UsuarioCadastrarDto): Promise<ResultadoDto> {
    let usuario = new Usuario();
    usuario.email = data.email;
    usuario.nome = data.nome;
    usuario.cpf = data.cpf;
    usuario.telefone = data.telefone;
    usuario.password = data.password;
    return this.usuarioRepository
      .save(usuario)
      .then((result) => {
        return <ResultadoDto>{
          status: true,
          message: 'usuario cadastrado com sucesso',
        };
      })
      .catch((error) => {
        return <ResultadoDto>{
          status: false,
          message: 'Houve um erro ao cadastrar o usuario',
        };
      });
  }
}
