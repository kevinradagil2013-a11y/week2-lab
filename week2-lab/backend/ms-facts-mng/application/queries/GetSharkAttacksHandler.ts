import type {
  SharkAttackProps,
} from '../../domain/entities/SharkAttack';

import {
  MongoSharkAttackRepository,
} from '../../infrastructure/mongodb/MongoSharkAttackRepository';

import type {
  GetSharkAttacksQuery,
} from './GetSharkAttacks';

export class GetSharkAttacksHandler {
  constructor(
    private readonly repository: MongoSharkAttackRepository,
  ) {}

  async execute(
    _query: GetSharkAttacksQuery,
  ): Promise<SharkAttackProps[]> {
    return this.repository.findAll();
  }
}