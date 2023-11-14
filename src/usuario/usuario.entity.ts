import { Servico } from 'src/servico/servico.entity';
import { Entrada } from 'src/Entradas/entrada.entity';
import { Despesa } from 'src/Despesas/despesa.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 100 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 15 })
  telefone: string;

  @Column({ length: 14 })
  cpf: string;

  @OneToMany(() => Servico, (servico) => servico.usuario, {
    cascade: true,
  })
  servicos: Servico[];

  @OneToMany(() => Entrada, (entrada) => entrada.usuario, {
    cascade: true,
  })
  entradas: Entrada[];

  @OneToMany(() => Despesa, (despesa) => despesa.usuario, {
    cascade: true,
  })
  despesas: Despesa[];
}
