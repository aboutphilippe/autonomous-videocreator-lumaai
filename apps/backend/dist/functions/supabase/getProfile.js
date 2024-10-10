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
exports.supabaseGetProfileTokens = supabaseGetProfileTokens;
const function_1 = require("@restackio/restack-sdk-ts/function");
const client_1 = require("./client");
function supabaseGetProfileTokens(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId }) {
        const { data, error } = yield (0, client_1.supabaseClient)()
            .from("profiles")
            .select("google_access_token, google_refresh_token")
            .eq("id", userId)
            .single();
        if (error) {
            throw function_1.FunctionFailure.nonRetryable("Error getting profile tokens");
        }
        return {
            accessToken: data === null || data === void 0 ? void 0 : data.google_access_token,
            refreshToken: data === null || data === void 0 ? void 0 : data.google_refresh_token,
        };
    });
}
