import type { SharkAttackReportedEvent } from '../../domain/events/SharkAttackReported';
import { MongoEventStore } from '../../infrastructure/event-store/MongoEventStore';
import { GooglePubSubPublisher } from '../../infrastructure/pubsub/GooglePubSubPublisher';
import { MongoSharkAttackRepository } from '../../infrastructure/mongodb/MongoSharkAttackRepository';

export class SharkAttackReportedConsumer {
  constructor(
    private readonly repository: MongoSharkAttackRepository,
    private readonly eventStore: MongoEventStore,
    private readonly publisher: GooglePubSubPublisher,
  ) {}

  async process(
    event: SharkAttackReportedEvent,
  ): Promise<boolean> {
    if (!event.eventId || event.aggregateId !== event.payload.id) {
      throw new Error('Invalid SharkAttackReported event.');
    }

    if (await this.repository.hasProcessedEvent(event.eventId)) {
      return false;
    }

    await Promise.all([
      this.repository.save(event.payload),
      this.eventStore.append(event),
      this.publisher.publish(event),
    ]);

    try {
      await this.repository.markEventProcessed(event.eventId);
    } catch (error) {
      if (!isDuplicateKeyError(error)) {
        throw error;
      }
    }

    return true;
  }
}

function isDuplicateKeyError(error: unknown): boolean {
  return typeof error === 'object'
    && error !== null
    && 'code' in error
    && error.code === 11000;
}