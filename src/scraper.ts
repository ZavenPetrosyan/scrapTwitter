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
        const bearerToken = await this.getBearerToken();
        if (!bearerToken) {
            console.error(`Error getting bearer token for "${topic}"`);
            return;
        }

        const query: any = {
            query: topic,
            'tweet.fields': 'text,author_id',
            expansions: 'author_id',
            'user.fields': 'username'
        };

        let response;
        try {
            response = await this.axiosInstance.get('/2/tweets/search/recent', {
                params: query,
                headers: {
                    Authorization: `Bearer ${bearerToken}`
                }
            });
        } catch (err) {
            console.error(`Error scraping tweets for "${topic}": ${err}`);
            return;
        }

        const tweets = response.data.data;
        const values = tweets.map((tweet: any) => [tweet.author_id,  tweet.id, tweet.text]);
        await this.db.insertTweets(values);
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
