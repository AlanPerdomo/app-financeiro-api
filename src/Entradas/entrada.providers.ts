import { Connection, Repository } from 'typeorm';
import { Entrada } from './entrada.entity';

export const entradaProviders = [
  {
    provide: 'ENTRADA_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Entrada),
    inject: ['DATABASE_CONNECTION'],
  },
];
