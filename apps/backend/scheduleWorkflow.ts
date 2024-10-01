import { client } from "./src/client";

export type InputScheduleVideo = {
  prompt: string;
  fromImageUrl: string;
};

async function scheduleVideo(input: InputScheduleVideo) {
  try {
    const workflowId = `${Date.now()}-createVideo`;
    const runId = await client.scheduleWorkflow({
      workflowName: "createVideo",
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

// scheduleVideo({
//   // prompt: "a baby panda clumsily rolling down a hill in a bamboo forest.",
//   // prompt:
//   //   " Baby Grogu sitting happily in his floating pod, exploring a vibrant Indian marketplace. Surround him with colorful fabrics, hanging lanterns, and spices in the background. Grogu uses the Force to playfully lift a small, shiny trinket or piece of fruit from a vendor’s stall. He smiles, wiggles his ears in excitement, and curiously looks around at the bustling scene. Capture close-ups of Grogu’s joyful expression and the lively, colorful surroundings. Add light, cheerful background music inspired by traditional Indian instruments.",
//   prompt:
//     "Baby Grogu happily floating in his pod near the Eiffel Tower at sunset. He uses the Force to playfully lift a small croissant into the air while smiling and gazing around in wonder. The background features the romantic streets of Paris, with cafés, flowers, and softly glowing streetlights. Grogu wiggles his ears in happiness as he enjoys the sights. Add light, French-inspired music to enhance the Parisian charm.",
//   fromImageUrl:
//     "https://ideogram.ai/assets/image/lossless/response/BlwFy5CxSoGXD6g2ZJQAVw",
// });

export type InputScheduleSeries = {
  title: string;
  prompt: string;
  amount: number;
};

async function scheduleSeries(input: InputScheduleSeries) {
  try {
    const workflowId = `${Date.now()}-createSeries`;
    const runId = await client.scheduleWorkflow({
      workflowName: "createSeries",
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

scheduleSeries({
  title: "Grogu Traveling",
  prompt: `Baby Grogu happily floating in his pod exploring earth most scenic place a diverse times of the day.
     He uses the Force to playfully lift objects unique to the place he visits into the air while smiling and gazing around in wonder.
     The background features an iconic scene from the place he visits.
     Grogu wiggles his ears in happiness as he enjoys the sights.
     The scene is very realistic, like a scene from a movie.
    `,
  amount: 1,
});
