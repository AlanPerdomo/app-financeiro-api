import { Connection, Repository } from 'typeorm';
import { Despesa } from './despesa.entity';

export const despesaProviders = [
  {
    provide: 'DESPESA_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Despesa),
    inject: ['DATABASE_CONNECTION'],
  },
];
