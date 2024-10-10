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
exports.azureWebSearch = azureWebSearch;
const function_1 = require("@restackio/restack-sdk-ts/function");
require("dotenv/config");
function azureWebSearch(_a) {
    return __awaiter(this, arguments, void 0, function* ({ query, apiKey = process.env.AZURE_BING_API, }) {
        try {
            if (!apiKey) {
                throw new Error("Azure api key ");
            }
            const headers = { "Ocp-Apim-Subscription-Key": apiKey };
            const params = {
                q: query,
                cc: "us",
                mkt: "us",
                setLang: "en",
                count: "10",
                textDecorations: "false",
                textFormat: "Raw",
            };
            const searchUrl = new URL("https://api.bing.microsoft.com/v7.0/search");
            Object.entries(params).forEach(([key, value]) => {
                searchUrl.searchParams.append(key, value);
            });
            const response = yield fetch(searchUrl, { headers });
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            const rawResults = yield response.json();
            const results = rawResults.webPages.value;
            if (results.length === 0) {
                return {
                    searchResults: [],
                    rawResults: [],
                };
            }
            const searchResults = results.map((result) => ({
                query,
                source: result.url,
                snippet: result.snippet,
            }));
            return {
                searchResults,
                rawResults,
            };
        }
        catch (error) {
            function_1.log.error("Encountered exception. ", { error });
            throw error;
        }
    });
}
