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
const functions_1 = require("./functions");
const integrations_lumaai_1 = require("@restackio/integrations-lumaai");
const integrations_azurespeech_1 = require("@restackio/integrations-azurespeech");
const integrations_openai_1 = require("@restackio/integrations-openai");
const integrations_fal_1 = require("@restackio/integrations-fal");
const client_1 = require("./client");
function services() {
    return __awaiter(this, void 0, void 0, function* () {
        const workflowsPath = require.resolve("./workflows");
        try {
            yield Promise.all([
                client_1.client.startService({
                    workflowsPath,
                    functions: {
                        mergeMedia: functions_1.mergeMedia,
                    },
                    options: {
                        rateLimit: 1000,
                    },
                }),
                client_1.client.startService({
                    taskQueue: "supabase",
                    workflowsPath,
                    functions: {
                        supabaseUpsertSerie: functions_1.supabaseUpsertSerie,
                        supabaseUpsertVideo: functions_1.supabaseUpsertVideo,
                        supabaseGetProfileTokens: functions_1.supabaseGetProfileTokens,
                        supabaseUpdateProfileTokens: functions_1.supabaseUpdateProfileTokens,
                        supabaseGetSerie: functions_1.supabaseGetSerie,
                        supabaseUpdateSerie: functions_1.supabaseUpdateSerie,
                    },
                    options: {
                        rateLimit: 100,
                    },
                }),
                client_1.client.startService({
                    taskQueue: "gcp",
                    workflowsPath,
                    functions: { uploadImageToBucket: functions_1.uploadImageToBucket, uploadVideoToBucket: functions_1.uploadVideoToBucket },
                    options: {
                        rateLimit: 100,
                    },
                }),
                // client.startService({
                //   taskQueue: "youtube",
                //   workflowsPath,
                //   functions: {
                //     youtubeAddVideoToPlaylist,
                //     youtubeCreatePlaylist,
                //   },
                //   options: {
                //     rateLimit: 10,
                //   },
                // }),
                // client.startService({
                //   taskQueue: "youtube-upload",
                //   workflowsPath,
                //   functions: {
                //     youtubeUpload,
                //   },
                //   options: {
                //     rateLimit: 1 / (6 * 24 * 60 * 60), // Default quota 6 per day
                //   },
                // }),
                (0, integrations_azurespeech_1.azureSpeechService)({ client: client_1.client }),
                (0, integrations_lumaai_1.lumaaiService)({ client: client_1.client }),
                (0, integrations_openai_1.openaiService)({ client: client_1.client }),
                (0, integrations_fal_1.falService)({ client: client_1.client }),
            ]);
            console.log("Services running successfully.");
        }
        catch (e) {
            console.error("Failed to run services", e);
        }
    });
}
services().catch((err) => {
    console.error("Error running services:", err);
});
