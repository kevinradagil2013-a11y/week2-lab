import {
    Collection,
    MongoClient,
} from 'mongodb';

import type {
    SharkAttackReportedEvent,
} from '../../domain/events/SharkAttackReported';

export class MongoEventStore {
  private readonly client: MongoClient;

  private collection:
    | Collection<SharkAttackReportedEvent>
    | null = null;

  constructor(
    private readonly uri: string =
      process.env.MONGODB_URI ??
      'mongodb://localhost:27017',

    private readonly databaseName: string =
      process.env.MONGODB_DATABASE ??
      'week2_lab',
  ) {
    this.client = new MongoClient(this.uri);
  }

  private async getCollection(): Promise<
    Collection<SharkAttackReportedEvent>
  > {
    if (this.collection) {
      return this.collection;
    }

    await this.client.connect();

    const database =
      this.client.db(this.databaseName);

    this.collection =
      database.collection<SharkAttackReportedEvent>(
        'event_store',
      );

    return this.collection;
  }

  async append(
    event: SharkAttackReportedEvent,
  ): Promise<void> {
    const collection =
      await this.getCollection();

    await collection.updateOne(
      { eventId: event.eventId },
      { $setOnInsert: event },
      { upsert: true },
    );
  }

  async appendMany(
    events: SharkAttackReportedEvent[],
  ): Promise<void> {
    if (events.length === 0) {
      return;
    }

    const collection =
      await this.getCollection();

    await collection.bulkWrite(
      events.map((event) => ({
        updateOne: {
          filter: { eventId: event.eventId },
          update: { $setOnInsert: event },
          upsert: true,
        },
      })),
    );
  }

  async findByAggregateId(
    aggregateId: number,
  ): Promise<
    SharkAttackReportedEvent[]
  > {
    const collection =
      await this.getCollection();

    return collection
      .find({
        aggregateId,
      })
      .sort({
        occurredAt: 1,
      })
      .toArray();
  }

  async findAll(): Promise<
    SharkAttackReportedEvent[]
  > {
    const collection =
      await this.getCollection();

    return collection
      .find({})
      .sort({
        occurredAt: 1,
      })
      .toArray();
  }

  async disconnect(): Promise<void> {
    await this.client.close();

    this.collection = null;
  }
}