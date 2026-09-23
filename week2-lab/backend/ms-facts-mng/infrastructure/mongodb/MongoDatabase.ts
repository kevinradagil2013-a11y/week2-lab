import { Db, MongoClient } from 'mongodb';

export class MongoDatabase {
  private readonly client: MongoClient;
  private db: Db | null = null;

  constructor(
    private readonly uri: string = process.env.MONGODB_URI ??
      'mongodb://localhost:27017',
    private readonly databaseName: string =
      process.env.MONGODB_DATABASE ?? 'week2_lab',
  ) {
    this.client = new MongoClient(this.uri);
  }

  async connect(): Promise<Db> {
    if (this.db) {
      return this.db;
    }

    await this.client.connect();

    this.db = this.client.db(this.databaseName);

    return this.db;
  }

  async disconnect(): Promise<void> {
    await this.client.close();
    this.db = null;
  }

  async ping(): Promise<boolean> {
    const database = await this.connect();

    await database.command({ ping: 1 });

    return true;
  }

  getDatabase(): Db {
    if (!this.db) {
      throw new Error(
        'MongoDB is not connected. Call connect() first.',
      );
    }

    return this.db;
  }
}