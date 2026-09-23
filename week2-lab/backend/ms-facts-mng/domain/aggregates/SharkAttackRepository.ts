import type {
    SharkAttackProps,
} from '../entities/SharkAttack';

export interface SharkAttackRepository {
  findById(
    id: number,
  ): Promise<SharkAttackProps | null>;

  findAll(): Promise<
    SharkAttackProps[]
  >;

  findByCountry(
    country: string,
    limit?: number,
  ): Promise<SharkAttackProps[]>;

  save(
    sharkAttack: SharkAttackProps,
  ): Promise<SharkAttackProps>;

  deleteById(
    id: number,
  ): Promise<void>;
}