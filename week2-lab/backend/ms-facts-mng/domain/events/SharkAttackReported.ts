import type { SharkAttackProps } from '../entities/SharkAttack';

export type SharkAttackReportedEvent = {
  eventId: string;
  aggregateId: number;
  aggregateType: 'SharkAttack';
  eventType: 'Reported';
  occurredAt: string;
  payload: SharkAttackProps;
};

export function createSharkAttackReportedEvent(
  aggregateId: number,
  payload: SharkAttackReportedEvent['payload'],
): SharkAttackReportedEvent {
  return {
    eventId: `shark-attack-reported-${aggregateId}`,
    aggregateId,
    aggregateType: 'SharkAttack',
    eventType: 'Reported',
    occurredAt: new Date().toISOString(),
    payload,
  };
}