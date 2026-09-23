import {
    SharkAttackAggregate,
} from '../../domain/aggregates/SharkAttackAggregate';

import {
    createSharkAttackReportedEvent,
    type SharkAttackReportedEvent,
} from '../../domain/events/SharkAttackReported';

import type {
    ReportSharkAttackCommand,
} from '../commands/ReportSharkAttack';

export type ReportSharkAttackResult = {
  aggregate: SharkAttackAggregate;
  event: SharkAttackReportedEvent;
};

export class ReportSharkAttackHandler {
  execute(
    command: ReportSharkAttackCommand,
  ): ReportSharkAttackResult {
    const aggregate = new SharkAttackAggregate(
      command.input,
    );

    const event = createSharkAttackReportedEvent(
      aggregate.id,
      {
        ...aggregate.toPrimitives(),
        país: aggregate.countryValue,
      },
    );

    return {
      aggregate,
      event,
    };
  }
}