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
exports.supabaseUpdateSerie = supabaseUpdateSerie;
const function_1 = require("@restackio/restack-sdk-ts/function");
const client_1 = require("./client");
function supabaseUpdateSerie(_a) {
    return __awaiter(this, arguments, void 0, function* ({ serieId, status, playlistId, }) {
        const { data, error } = yield (0, client_1.supabaseClient)()
            .from("series")
            .update({
            id: serieId,
            status,
            playlist_id: playlistId,
        })
            .select();
        if (error) {
            throw function_1.FunctionFailure.nonRetryable("Error updating serie status");
        }
        return data;
    });
}
