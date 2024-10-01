"use server";
import Restack from "@restackio/restack-sdk-ts";

const connectionOptions = {
  engineId: process.env.RESTACK_ENGINE_ID!,
  address: process.env.RESTACK_ENGINE_ADDRESS!,
  apiKey: process.env.RESTACK_ENGINE_API_KEY!,
};

const client = new Restack(
  process.env.RESTACK_ENGINE_API_KEY ? connectionOptions : undefined
);

export async function getWorkflow(workflowId: string, runId: string) {
  if (!workflowId || !runId) {
    throw new Error("Workflow id and run id are required");
  }

  const result = await client.getWorkflowResult({
    workflowId,
    runId,
  });

  return result;
}
