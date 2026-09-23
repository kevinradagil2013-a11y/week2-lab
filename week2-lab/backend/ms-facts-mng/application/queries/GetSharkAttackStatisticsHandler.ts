import type {
  CountryAttackStat,
  MongoSharkAttackRepository,
  YearAttackStat,
} from '../../infrastructure/mongodb/MongoSharkAttackRepository';

import type { GetSharkAttackStatisticsQuery } from './GetSharkAttackStatistics';

export type SharkAttackStatistics = {
  total: number;
  byCountry: CountryAttackStat[];
  byYear: YearAttackStat[];
};

export class GetSharkAttackStatisticsHandler {
  constructor(
    private readonly repository: MongoSharkAttackRepository,
  ) {}

  async execute(
    _query: GetSharkAttackStatisticsQuery,
  ): Promise<SharkAttackStatistics> {
    const [total, byCountry, byYear] = await Promise.all([
      this.repository.countAll(),
      this.repository.countByCountry(),
      this.repository.countByYear(),
    ]);

    return { total, byCountry, byYear };
  }
}