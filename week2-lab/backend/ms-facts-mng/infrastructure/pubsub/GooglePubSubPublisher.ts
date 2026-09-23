import { PubSub } from '@google-cloud/pubsub';

import type { SharkAttackReportedEvent } from '../../domain/events/SharkAttackReported';

export class GooglePubSubPublisher {
  private readonly projectId =
    process.env.GCP_PROJECT_ID ?? 'nebulae-lab';

  private readonly topicName =
    process.env.PUBSUB_TOPIC ?? 'neb-university-kevin-rada-gil';

  private readonly pubSub: PubSub | null;

  constructor() {
    this.pubSub = process.env.PUBSUB_ENABLED === 'true'
      ? new PubSub({ projectId: this.projectId })
      : null;
  }

  async publish(
    event: SharkAttackReportedEvent,
  ): Promise<void> {
    if (!this.pubSub) {
      return;
    }

    await this.pubSub
      .topic(this.topicName)
      .publishMessage({
        data: Buffer.from(JSON.stringify(event)),
        attributes: {
          eventType: event.eventType,
          aggregateType: event.aggregateType,
          eventId: event.eventId,
        },
      });
  }
}