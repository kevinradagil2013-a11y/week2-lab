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
    if (
      !event.eventId ||
      event.aggregateId !== event.payload.id
    ) {
      throw new Error(
        'Invalid SharkAttackReported event.',
      );
    }

    const claimed =
      await this.repository.tryClaimEvent(
        event.eventId,
      );

    if (!claimed) {
      return false;
    }

    try {
      await Promise.all([
        this.repository.save(
          event.payload,
        ),
        this.eventStore.append(
          event,
        ),
        this.publisher.publish(
          event,
        ),
      ]);

      return true;
    } catch (error) {
      await this.repository.releaseEventClaim(
        event.eventId,
      );

      throw error;
    }
  }
}
