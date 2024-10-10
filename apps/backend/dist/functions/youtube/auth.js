"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthClient = getAuthClient;
const googleapis_1 = require("googleapis");
const function_1 = require("@restackio/restack-sdk-ts/function");
let globalAccessToken = null;
let globalRefreshToken = null;
function getAuthClient(accessToken, refreshToken) {
    const tokens = {
        access_token: globalAccessToken || accessToken,
        refresh_token: globalRefreshToken || refreshToken,
    };
    const auth = new googleapis_1.google.auth.OAuth2({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    });
    auth.setCredentials(tokens);
    auth.on("tokens", (tokens) => {
        var _a;
        if (tokens.refresh_token) {
            globalRefreshToken = tokens.refresh_token;
            function_1.log.info("New refresh token:", { refreshToken: tokens.refresh_token });
        }
        globalAccessToken = (_a = tokens.access_token) !== null && _a !== void 0 ? _a : null;
        function_1.log.info("New access token:", { accessToken: tokens.access_token });
    });
    return auth;
}
