import { Database } from './database';
import { AxiosInstance } from 'axios';
import { AxiosHelper } from './requestHelper';

export class TwitterScraper {
    private readonly db: Database;
    private readonly axiosInstance: AxiosInstance;

    constructor(database: Database) {
        this.db = database;
        this.axiosInstance = AxiosHelper.GetAxiosInstance();
    }

    async scrapeTopic(topic: string): Promise<void> {
        try {
            const query = {
                query: topic,
                max_results: 100,
                tweet_fields: ['text', 'author_id']
            };
            const bearerToken = await this.getBearerToken();

            const { data: { data: tweets } } = await this.axiosInstance.get('/tweets/search/recent', {
                params: query,
                headers: {
                    Authorization: `Bearer ${bearerToken}`
                }
            });

            const values = tweets.map((tweet: any) => [tweet.id, tweet.text, tweet.author_id]);

            await this.db.insertTweets(values);
            console.log(`Scraped ${tweets.length} tweets for "${topic}".`);
        } catch (err) {
            console.error(`Error scraping tweets for "${topic}": ${err}`);
        }
    }

    async getBearerToken() {
        const encodedCredentials = Buffer.from(`${process.env.TWITTER_API_KEY}:${process.env.TWITTER_API_KEY_SECRET}`).toString('base64');

        try {
            const response = await this.axiosInstance.post('/oauth2/token', 'grant_type=client_credentials', {
                headers: {
                    Authorization: `Basic ${encodedCredentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
            });

            return response.data.access_token;
        } catch (error: any) {
            console.error(error.response.data);
            throw new Error('Failed to get bearer token');
        }
    }
}