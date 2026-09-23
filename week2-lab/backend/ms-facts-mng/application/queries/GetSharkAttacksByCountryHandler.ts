import type {
  SharkAttackProps,
} from '../../domain/entities/SharkAttack';

import {
  OpenDataSoftClient,
} from '../../infrastructure/external-api/OpenDataSoftClient';

import {
  SharkAttackFallbackProvider,
} from '../../infrastructure/external-api/SharkAttackFallbackProvider';

import {
  mapSharkAttack,
} from '../../infrastructure/external-api/SharkAttackMapper';

import {
  MongoSharkAttackRepository,
} from '../../infrastructure/mongodb/MongoSharkAttackRepository';

import type {
  GetSharkAttacksByCountryQuery,
} from './GetSharkAttacksByCountry';

export type GetSharkAttacksByCountryResult = {
  records: SharkAttackProps[];
  source: 'mongodb' | 'opendatasoft' | 'fallback';
};

export class GetSharkAttacksByCountryHandler {
  constructor(
    private readonly repository: MongoSharkAttackRepository,
    private readonly externalClient: OpenDataSoftClient,
    private readonly fallbackProvider: SharkAttackFallbackProvider,
  ) {}

  async execute(
    query: GetSharkAttacksByCountryQuery,
  ): Promise<GetSharkAttacksByCountryResult> {
    let records =
      await this.repository.findByCountry(
        query.country,
        5,
      );

    let source:
      | 'mongodb'
      | 'opendatasoft'
      | 'fallback' = 'mongodb';

    if (records.length === 0) {
      try {
        const externalRecords =
          await this.externalClient.getSharkAttacksByCountry(
            query.country,
          );

        records = externalRecords.map(
          (record) => mapSharkAttack(record),
        );

        source = 'opendatasoft';
      } catch (error) {
        console.warn(
          'OpenDataSoft country query failed:',
          error,
        );
      }
    }

    if (records.length === 0) {
      const fallbackRecords =
        await this.fallbackProvider.getSharkAttacksByCountry(
          query.country,
        );

      records = fallbackRecords.map(
        (record) => mapSharkAttack(record),
      );

      source = 'fallback';
    }

    return {
      records,
      source,
    };
  }
}