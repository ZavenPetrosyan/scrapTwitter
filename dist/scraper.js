"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const requestHelper_1 = require("./requestHelper");
class TwitterScraper {
    constructor(database) {
        this.db = database;
        this.axiosInstance = requestHelper_1.AxiosHelper.GetAxiosInstance();
    }
    scrapeTopic(topic) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = {
                    query: topic,
                    max_results: 100,
                    tweet_fields: ['text', 'author_id']
                };
                yield this.getBearerToken();
                const { data: tweets } = yield this.axiosInstance.get('tweets/search/recent');
                const values = tweets.map((tweet) => {
                    return [tweet.id, tweet.text, tweet.author_id];
                });
                yield this.db.insertTweets(values);
                console.log(`Scraped ${tweets.length} tweets for "${topic}".`);
            }
            catch (err) {
                console.error(`Error scraping tweets for "${topic}": ${err}`);
            }
        });
    }
    getBearerToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const encodedCredentials = Buffer.from(`${process.env.TWITTER_API_KEY}:${process.env.TWITTER_API_KEY_SECRET}`).toString('base64');
            try {
                const response = yield this.axiosInstance.post('https://api.twitter.com/oauth2/token', 'grant_type=client_credentials', {
                    headers: {
                        Authorization: `Basic ${encodedCredentials}`,
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    },
                });
                return response.data.access_token;
            }
            catch (error) {
                console.error(error.response.data);
                throw new Error('Failed to get bearer token');
            }
        });
    }
}
exports.default = TwitterScraper;
// import Twitter from 'twitter';
// import { Database } from './database';
// export class Scraper {
//     private client: Twitter;
//     private db: Database;
//     private topics: string[];
//     constructor(database: Database) {
//         this.client = new Twitter({
//             consumer_key: process.env.TWITTER_API_KEY!,
//             consumer_secret: process.env.TWITTER_API_KEY_SECRET!,
//             access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY!,
//             access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
//         });
//         this.db = database;
//         this.topics = ['Led Zeppelin', 'Milano', 'Docker'];
//     }
//     public async scrapeTopic(topic: string): Promise<void> {
//         try {
//             const params = { q: topic };
//             const tweets = await this.client.get('search/tweets', params);
//             const values = tweets.statuses.map((tweet: Record<string, any>) => {
//                 return [tweet.id, tweet.text, tweet.user.screen_name];
//             });
//             await this.db.insertTweets(values);
//             console.log(`Scraped ${tweets.statuses.length} tweets for "${topic}".`);
//         } catch (err) {
//             console.error(`Error scraping tweets for "${topic}": ${err}`);
//         }
//     }
//     public async scrapeTopics(): Promise<void> {
//         for (const topic of this.topics) {
//             await this.scrapeTopic(topic);
//         }
//     }
// }
//# sourceMappingURL=scraper.js.map