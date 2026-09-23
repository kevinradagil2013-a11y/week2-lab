import type {
  SharkAttackProps,
} from '../../domain/entities/SharkAttack';

import {
  MongoSharkAttackRepository,
} from '../../infrastructure/mongodb/MongoSharkAttackRepository';

import type {
  GetSharkAttackByIdQuery,
} from './GetSharkAttackById';

export class GetSharkAttackByIdHandler {
  constructor(
    private readonly repository: MongoSharkAttackRepository,
  ) {}

  async execute(
    query: GetSharkAttackByIdQuery,
  ): Promise<SharkAttackProps | null> {
    return this.repository.findById(query.id);
  }
}