import {
  Collection,
  Filter,
  MongoClient,
} from 'mongodb';

import type {
  SharkAttackProps,
} from '../../domain/entities/SharkAttack';

export type CountryAttackStat = {
  country: string;
  count: number;
};

export type YearAttackStat = {
  year: number;
  count: number;
};

type ProcessedEvent = {
  eventId: string;
  processedAt: string;
};

export class MongoSharkAttackRepository {
  private readonly client: MongoClient;

  private readonly databaseName: string;

  private readonly collectionName =
    'shark_attacks';

  private readonly processedEventsCollectionName =
    'processed_events';

  private database:
    ReturnType<
      MongoClient['db']
    > | null = null;

  constructor(
    uri: string =
      process.env.MONGODB_URI ??
      'mongodb://localhost:27017',
    databaseName: string =
      process.env.MONGODB_DATABASE ??
      'week2_lab',
  ) {
    this.client =
      new MongoClient(uri);

    this.databaseName =
      databaseName;
  }

  private async getCollection(): Promise<
    Collection<
      SharkAttackProps & {
        _id: number;
      }
    >
  > {
    if (!this.database) {
      await this.connect();
    }

    if (!this.database) {
      throw new Error(
        'MongoDB database is not connected.',
      );
    }

    return this.database.collection<
      SharkAttackProps & {
        _id: number;
      }
    >(
      this.collectionName,
    );
  }

  async connect(): Promise<void> {
    if (this.database) {
      return;
    }

    await this.client.connect();

    this.database =
      this.client.db(
        this.databaseName,
      );

    await Promise.all([
      this.database
        .collection(this.collectionName)
        .createIndex({ ['pa\u00eds']: 1 }),

      this.database
        .collection(this.collectionName)
        .createIndex({ ['a\u00f1o']: 1 }),

      this.database
        .collection<ProcessedEvent>(
          this.processedEventsCollectionName,
        )
        .createIndex(
          { eventId: 1 },
          { unique: true },
        ),
    ]);
  }

  async disconnect(): Promise<void> {
    await this.client.close();
    this.database = null;
  }

  async findById(
    id: number,
  ): Promise<SharkAttackProps | null> {
    const collection =
      await this.getCollection();

    const document =
      await collection.findOne({
        _id: id,
      });

    if (!document) {
      return null;
    }

    return this.toDomain(document);
  }

  async findAll(): Promise<
    SharkAttackProps[]
  > {
    const collection =
      await this.getCollection();

    const documents =
      await collection
        .find({})
        .sort({ _id: 1 })
        .toArray();

    return documents.map(
      (document) =>
        this.toDomain(document),
    );
  }

  async findByCountry(
    country: string,
    limit = 5,
  ): Promise<SharkAttackProps[]> {
    const collection =
      await this.getCollection();

    const normalizedCountry =
      country
        .trim()
        .toUpperCase();

    if (!normalizedCountry) {
      return [];
    }

    const safeLimit =
      Math.min(
        Math.max(limit, 1),
        100,
      );

    const filter: Filter<
      SharkAttackProps & {
        _id: number;
      }
    > = {
      ['pa\u00eds']: {
        $regex:
          `^${this.escapeRegex(
            normalizedCountry,
          )}$`,
        $options: 'i',
      },
    };

    const documents =
      await collection
        .find(filter)
        .sort({ _id: 1 })
        .limit(safeLimit)
        .toArray();

    return documents.map(
      (document) =>
        this.toDomain(document),
    );
  }

  async save(
    sharkAttack: SharkAttackProps,
  ): Promise<SharkAttackProps> {
    const collection =
      await this.getCollection();

    const document = {
      ...sharkAttack,
      _id: sharkAttack.id,
    };

    await collection.replaceOne(
      { _id: sharkAttack.id },
      document,
      {
        upsert: true,
      },
    );

    return sharkAttack;
  }

  async tryClaimEvent(
    eventId: string,
  ): Promise<boolean> {
    if (!this.database) {
      await this.connect();
    }

    if (!this.database) {
      throw new Error(
        'MongoDB database is not connected.',
      );
    }

    try {
      await this.database
        .collection<ProcessedEvent>(
          this.processedEventsCollectionName,
        )
        .insertOne({
          eventId,
          processedAt:
            new Date().toISOString(),
        });

      return true;
    } catch (error) {
      if (isDuplicateKeyError(error)) {
        return false;
      }

      throw error;
    }
  }

  async releaseEventClaim(
    eventId: string,
  ): Promise<void> {
    if (!this.database) {
      await this.connect();
    }

    if (!this.database) {
      throw new Error(
        'MongoDB database is not connected.',
      );
    }

    await this.database
      .collection<ProcessedEvent>(
        this.processedEventsCollectionName,
      )
      .deleteOne({
        eventId,
      });
  }

  async countAll(): Promise<number> {
    const collection =
      await this.getCollection();

    const result =
      await collection
        .aggregate<{ total: number }>([
          {
            $count: 'total',
          },
        ])
        .toArray();

    return result[0]?.total ?? 0;
  }

  async countByCountry(): Promise<
    CountryAttackStat[]
  > {
    const collection =
      await this.getCollection();

    return collection
      .aggregate<CountryAttackStat>([
        {
          $match: {
            ['pa\u00eds']: {
              $nin: [null, ''],
            },
          },
        },
        {
          $group: {
            _id: '$pa\u00eds',
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
            _id: 1,
          },
        },
        {
          $limit: 5,
        },
        {
          $project: {
            _id: 0,
            country: '$_id',
            count: 1,
          },
        },
      ])
      .toArray();
  }

  async countByYear(): Promise<
    YearAttackStat[]
  > {
    const collection =
      await this.getCollection();

    return collection
      .aggregate<YearAttackStat>([
        {
          $match: {
            ['a\u00f1o']: {
              $ne: null,
            },
          },
        },
        {
          $group: {
            _id: '$a\u00f1o',
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $project: {
            _id: 0,
            year: '$_id',
            count: 1,
          },
        },
      ])
      .toArray();
  }

  async deleteById(
    id: number,
  ): Promise<void> {
    const collection =
      await this.getCollection();

    await collection.deleteOne({
      _id: id,
    });
  }

  private toDomain(
    document:
      SharkAttackProps & {
        _id: number;
      },
  ): SharkAttackProps {
    const {
      _id,
      ...sharkAttack
    } = document;

    return {
      ...sharkAttack,
      id: _id,
    };
  }

  private escapeRegex(
    value: string,
  ): string {
    return value.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    );
  }
}

function isDuplicateKeyError(
  error: unknown,
): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 11000
  );
}
