import { Client } from 'pg';

export class Database {
  private client: Client;

  constructor() {
    this.client = new Client({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DATABASE,
      password: process.env.POSTGRES_PASSWORD,
      port: parseInt(process.env.POSTGRES_PORT!),
    });
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      console.error('failed to connect DB!');
    }
  }

  public async disconnect(): Promise<void> {
    await this.client.end();
  }

  public async insertTweets(values: any[][]): Promise<void> {
    for (let index = 0; index < values.length; index++) {
      await this.client.query(
        'INSERT INTO tweet (author_id, tweet_id, text) VALUES ($1, $2, $3)',
        values[index]
      );
    }
  }
}
