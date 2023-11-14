import { Usuario } from 'src/usuario/usuario.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Despesa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  titulo: string;

  @Column({ length: 255 })
  descricao: string;

  @Column({ length: 255 })
  valor: string;

  @Column({ length: 255 })
  tipo: string;

  @Column({ length: 255 })
  data: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.despesas, {
    onDelete: 'CASCADE',
  })
  usuario: Usuario;
}
