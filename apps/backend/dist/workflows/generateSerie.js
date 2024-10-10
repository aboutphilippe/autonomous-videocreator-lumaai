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
exports.generateSerie = generateSerie;
const workflow_1 = require("@restackio/restack-sdk-ts/workflow");
const taskQueue_1 = require("@restackio/integrations-openai/taskQueue");
const taskQueue_2 = require("@restackio/integrations-fal/taskQueue");
const zod_1 = require("zod");
const zod_to_json_schema_1 = __importDefault(require("zod-to-json-schema"));
function generateSerie(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, title, prompt, amount, serieId, }) {
        const previewsSchema = zod_1.z.object({
            seriesDescription: zod_1.z.string().describe("The description of the series."),
            previews: zod_1.z.array(zod_1.z.object({
                title: zod_1.z.string().describe("The title of the video."),
                imagePrompt: zod_1.z.string().describe("The prompt of the image."),
            })),
        });
        const seriesJsonSchema = {
            name: "series",
            schema: (0, zod_to_json_schema_1.default)(previewsSchema),
        };
        const seriesOutput = yield (0, workflow_1.step)({
            taskQueue: taskQueue_1.openaiTaskQueue,
        }).openaiChatCompletionsBase({
            userContent: prompt,
            model: "gpt-4o-mini",
            systemContent: `Based on the user prompt, create a variety of scenarios for a series of videos.
      For each video preview, make the image prompt used for generating the first frame of the video.
      Return max ${amount} previews.
      Be very descriptive of the character in the scene so there is no confusion and not generate images of anybody else than the character in the scene.
      `,
            jsonSchema: seriesJsonSchema,
        });
        const seriesResponse = seriesOutput.result.choices[0].message.content;
        if (!seriesResponse) {
            throw new Error("No series response");
        }
        const previews = JSON.parse(seriesResponse);
        const imagePreviews = yield Promise.all(previews.previews.map((preview) => __awaiter(this, void 0, void 0, function* () {
            const { images } = yield (0, workflow_1.step)({
                taskQueue: taskQueue_2.falTaskQueue,
            }).falRun({
                id: "fal-ai/flux/schnell",
                prompt: preview.imagePrompt,
                imageSize: "portrait_16_9",
                numInferenceSteps: 4,
                enableSafetyChecker: false,
            });
            return Object.assign(Object.assign({}, preview), { images: images });
        })));
        workflow_1.log.info("imagePreviews", { imagePreviews });
        const upsertedSerie = yield (0, workflow_1.step)({
            taskQueue: "supabase",
        }).supabaseUpsertSerie({
            serie: Object.assign(Object.assign({}, (serieId && { id: serieId })), { title,
                prompt }),
            images: imagePreviews.map((imagePreview) => ({
                title: imagePreview.title,
                prompt: imagePreview.imagePrompt,
                url: imagePreview.images[0].url,
                width: imagePreview.images[0].width,
                height: imagePreview.images[0].height,
                content_type: imagePreview.images[0].content_type,
            })),
        });
        return {
            title,
            prompt,
            imagePreviews,
            upsertedSerie,
        };
    });
}
