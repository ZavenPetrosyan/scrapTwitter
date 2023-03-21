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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const { config } = require('dotenv');
const database_1 = require("./database");
const scraper_1 = __importDefault(require("./scraper"));
config();
class Main {
    constructor() {
        this.db = new database_1.Database();
        this.client = new scraper_1.default(this.db);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('app starting...');
            try {
                yield this.db.connect();
                const topic = 'javascript';
                yield this.client.scrapeTopic(topic);
                console.log(`Scraping complete for "${topic}"!`);
            }
            catch (err) {
                console.error(`Error scraping topics: ${err}`);
            }
            finally {
                yield this.db.disconnect();
            }
            console.log('app started...');
        });
    }
}
const main = new Main();
main.start();
//# sourceMappingURL=main.js.map