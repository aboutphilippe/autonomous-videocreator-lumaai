"use server";
import Restack from "@restackio/restack-sdk-ts";
import { Example } from "../components/examplesList";
import { auth } from "../auth";

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

  const session = await auth();
  //@ts-ignore
  const accessToken = session?.accessToken;
  //@ts-ignore
  const refreshToken = session?.refreshToken;

  const runId = await client.scheduleWorkflow({
    workflowName: workflowName as string,
    workflowId,
    input: {
      ...input,
      accessToken,
      refreshToken,
    },
  });

  const result = await client.getWorkflowResult({
    workflowId,
    runId,
  });

  return {
    workflowId,
    runId,
    output: result,
  };
}
