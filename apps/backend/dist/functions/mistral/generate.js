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
exports.mistralGenerateText = mistralGenerateText;
const mistral_1 = require("@ai-sdk/mistral");
const ai_1 = require("ai");
function mistralGenerateText(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const { text } = yield (0, ai_1.generateText)({
            model: (0, mistral_1.mistral)("mistral-large-latest"),
            prompt: `${input.prompt}`,
        });
        const cleanedText = text.replace(/^"|"$/g, "");
        return { message: cleanedText };
    });
}
