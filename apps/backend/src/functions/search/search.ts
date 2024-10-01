import { log } from "@restackio/restack-sdk-ts/function";
import "dotenv/config";

export async function azureWebSearch({
  query,
  apiKey = process.env.AZURE_BING_API,
}: {
  query: string;
  apiKey?: string;
}) {
  try {
    if (!apiKey) {
      throw new Error("Azure api key ");
    }

    const headers = { "Ocp-Apim-Subscription-Key": apiKey };
    const params = {
      q: query,
      cc: "us",
      mkt: "us",
      setLang: "en",
      count: "10",
      textDecorations: "false",
      textFormat: "Raw",
    };
    const searchUrl = new URL("https://api.bing.microsoft.com/v7.0/search");

    Object.entries(params).forEach(([key, value]) => {
      searchUrl.searchParams.append(key, value);
    });

    const response = await fetch(searchUrl, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const rawResults = await response.json();
    const results: [] = rawResults.webPages.value;

    if (results.length === 0) {
      return {
        searchResults: [],
        rawResults: [],
      };
    }

    const searchResults = results.map(
      (result: { url: string; snippet: string }) => ({
        query,
        source: result.url,
        snippet: result.snippet,
      })
    );

    return {
      searchResults,
      rawResults,
    };
  } catch (error) {
    log.error("Encountered exception. ", { error });
    throw error;
  }
}
