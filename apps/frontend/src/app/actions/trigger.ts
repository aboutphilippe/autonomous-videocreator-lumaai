"use server";
import Restack from "@restackio/restack-sdk-ts";
import { Example } from "../components/examplesList";
import { getUser } from "@/utils/supabase/server";

const connectionOptions = {
  engineId: process.env.RESTACK_ENGINE_ID!,
  address: process.env.RESTACK_ENGINE_ADDRESS!,
  apiKey: process.env.RESTACK_ENGINE_API_KEY!,
};

const client = new Restack(
  process.env.RESTACK_ENGINE_API_KEY ? connectionOptions : undefined
);

export async function triggerWorkflow(
  workflowName: Example["workflowName"],
  input: Example["input"]
) {
  if (!workflowName || !input) {
    throw new Error("Workflow name and input are required");
  }

  const workflowId = `${Date.now()}-${workflowName.toString()}`;

  const { user } = await getUser();

  const runId = await client.scheduleWorkflow({
    workflowName: workflowName as string,
    workflowId,
    input: {
      ...input,
      userId: user?.id,
    },
  });

  const result = await client.getWorkflowResult({
    workflowId,
    runId,
  });

  console.log("result", result);

  return {
    workflowId,
    runId,
    output: result,
  };
}
