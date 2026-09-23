import type {
    ImportSharkAttacksCommand,
} from '../commands/ImportSharkAttacks';

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
    createSharkAttackReportedEvent,
    type SharkAttackReportedEvent,
} from '../../domain/events/SharkAttackReported';

export type ImportSharkAttacksResult = {
  imported: number;
  events: number;
  source: 'opendatasoft' | 'fallback';
  emittedEvents: SharkAttackReportedEvent[];
};

export class ImportSharkAttacksHandler {
  constructor(
    private readonly externalClient =
      new OpenDataSoftClient(),

    private readonly fallbackProvider =
      new SharkAttackFallbackProvider(),

  ) {}

  async execute(
    command: ImportSharkAttacksCommand,
  ): Promise<ImportSharkAttacksResult> {
    if (
      command.type !== 'ImportSharkAttacks'
    ) {
      throw new Error(
        'Invalid command type',
      );
    }

    let records;
    let source:
      | 'opendatasoft'
      | 'fallback';

    try {
      records =
        await this.externalClient
          .getSharkAttacks();

      source = 'opendatasoft';
    } catch (error) {
      console.warn(
        'OpenDataSoft unavailable. Using fallback provider.',
      );

      console.warn(
        error instanceof Error
          ? error.message
          : error,
      );

      records =
        await this.fallbackProvider
          .getSharkAttacks(100);

      source = 'fallback';
    }

    const events: SharkAttackReportedEvent[] = [];

    for (const record of records) {
      const sharkAttack =
        mapSharkAttack(record);

      events.push(
        createSharkAttackReportedEvent(
          sharkAttack.id,
          sharkAttack,
        ),
      );
    }

    return {
      imported: records.length,
      events: events.length,
      source,
      emittedEvents: events,
    };
  }
}