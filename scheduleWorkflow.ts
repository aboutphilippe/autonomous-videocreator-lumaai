import { client } from "./src/client";

export type InputSchedule = {
  prompt: string;
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
  prompt:
    "make me an ad of a robot in holidays at the beach. with a white hat, a blue bermuda and a beach bag on her shoulder",
});
