"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosHelper = void 0;
const axios_1 = __importDefault(require("axios"));
class AxiosHelper {
    static GetAxiosInstance() {
        return axios_1.default.create({
            baseURL: process.env.webportal_extrapi_url,
        });
    }
}
exports.AxiosHelper = AxiosHelper;
//# sourceMappingURL=requestHelper.js.map