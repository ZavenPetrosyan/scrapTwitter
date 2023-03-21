const { config } = require('dotenv');
import express from 'express';
import { Database } from './database';
import { TwitterScraper } from './scraper';

config();

class Main {
    private db: Database;
    private client: TwitterScraper;
    private app: express.Application;

    constructor() {
        this.db = new Database();
        this.client = new TwitterScraper(this.db);
        this.app = express();
        this.app.get('/scrape/:topic', async (req, res) => {
            try {
                const { topic } = req.params;
                await this.scrapeTopic(topic);
                res.send(`Scraping complete for "${topic}"!`);
            } catch (err) {
                console.error(`Error scraping topic: ${err}`);
                res.status(500).send(`Error scraping topic: ${err}`);
            }
        });
    }

    async start(): Promise<void> {
        console.log('app starting...');
        try {
            await this.db.connect();
            this.app.listen(process.env.PORT || 3000, () => {
                console.log(`App listening on port ${process.env.PORT || 3000}!`);
            });
        } catch (err) {
            console.error(`Error starting app: ${err}`);
        }
    }

    async scrapeTopic(topic: string): Promise<void> {
        console.log(`Scraping topic "${topic}"...`);
        await this.client.scrapeTopic(topic);
        console.log(`Scraping complete for "${topic}"!`);
    }
}

const main = new Main();
main.start();
