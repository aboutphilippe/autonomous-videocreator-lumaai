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
exports.supabaseUpsertSerie = supabaseUpsertSerie;
const function_1 = require("@restackio/restack-sdk-ts/function");
const client_1 = require("./client");
function supabaseUpsertSerie(_a) {
    return __awaiter(this, arguments, void 0, function* ({ serie, images, }) {
        const supabase = (0, client_1.supabaseClient)();
        // Upsert the series
        const { data: upsertedSerie, error: serieError } = yield supabase
            .from("series")
            .upsert(serie)
            .select();
        if (serieError) {
            throw function_1.FunctionFailure.nonRetryable("Error upserting series");
        }
        const seriesId = upsertedSerie[0].id;
        // Prepare images data with the series_id
        const imagesWithSeriesId = images.map((image) => (Object.assign(Object.assign({}, image), { series_id: seriesId })));
        // Upsert the images
        const { error: imagesError } = yield supabase
            .from("images")
            .upsert(imagesWithSeriesId);
        if (imagesError) {
            throw function_1.FunctionFailure.nonRetryable("Error upserting image series");
        }
        return {
            serie: upsertedSerie,
        };
    });
}
