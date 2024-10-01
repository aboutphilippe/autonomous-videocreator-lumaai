import { client } from "./src/client";

export type InputSchedule = {
  prompt: string;
  fromImageUrl: string;
};

async function scheduleWorkflow(input: InputSchedule) {
  try {
    const workflowId = `${Date.now()}-adWorkflow`;
    const runId = await client.scheduleWorkflow({
      workflowName: "adWorkflow",
      workflowId,
      input,
    });

    const result = await client.getWorkflowResult({ workflowId, runId });

    console.log("Workflow result:", result);

    process.exit(0); // Exit the process successfully
  } catch (error) {
    console.error("Error scheduling workflow:", error);
    process.exit(1); // Exit the process with an error code
  }
}

scheduleWorkflow({
  // prompt: "a baby panda clumsily rolling down a hill in a bamboo forest.",
  // prompt:
  //   " Baby Grogu sitting happily in his floating pod, exploring a vibrant Indian marketplace. Surround him with colorful fabrics, hanging lanterns, and spices in the background. Grogu uses the Force to playfully lift a small, shiny trinket or piece of fruit from a vendor’s stall. He smiles, wiggles his ears in excitement, and curiously looks around at the bustling scene. Capture close-ups of Grogu’s joyful expression and the lively, colorful surroundings. Add light, cheerful background music inspired by traditional Indian instruments.",
  prompt:
    "Baby Grogu happily floating in his pod near the Eiffel Tower at sunset. He uses the Force to playfully lift a small croissant into the air while smiling and gazing around in wonder. The background features the romantic streets of Paris, with cafés, flowers, and softly glowing streetlights. Grogu wiggles his ears in happiness as he enjoys the sights. Add light, French-inspired music to enhance the Parisian charm.",
  fromImageUrl:
    "https://ideogram.ai/assets/image/lossless/response/BlwFy5CxSoGXD6g2ZJQAVw",
});
