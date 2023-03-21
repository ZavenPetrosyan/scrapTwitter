const { config } = require('dotenv');
import { Database } from './database';
import TwitterScraper from './scraper';

config();

class Main {
    private db: Database;
    private client: TwitterScraper;

    constructor() {
        this.db = new Database();
        this.client = new TwitterScraper(this.db);
    }

    async start(): Promise<void> {
        console.log('app starting...');
        try {
            await this.db.connect();
            const topic = 'javascript';
            await this.client.scrapeTopic(topic);
            console.log(`Scraping complete for "${topic}"!`);
        } catch (err) {
            console.error(`Error scraping topics: ${err}`);
        } finally {
            await this.db.disconnect();
        }
        console.log('app started...');
    }
}

const main = new Main();
main.start();
