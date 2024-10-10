"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.connectionOptions = void 0;
const restack_sdk_ts_1 = __importDefault(require("@restackio/restack-sdk-ts"));
require("dotenv/config");
exports.connectionOptions = {
    engineId: process.env.RESTACK_ENGINE_ID,
    address: process.env.RESTACK_ENGINE_ADDRESS,
    apiKey: process.env.RESTACK_ENGINE_API_KEY,
};
exports.client = new restack_sdk_ts_1.default(process.env.RESTACK_ENGINE_API_KEY ? exports.connectionOptions : undefined);
