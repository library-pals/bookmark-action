import { warning } from "@actions/core";
import fetch from "node-fetch";

type WayBackResponse = {
  archived_snapshots: {
    closest?: {
      available: boolean;
      url: string;
      timestamp: string;
      status: string;
    };
  };
};

export async function checkWaybackStatus(
  url: string
): Promise<WayBackResponse | undefined> {
  try {
    const response = await fetch(
      `https://archive.org/wayback/available?url=${url}`
    );
    return (await response.json()) as WayBackResponse;
  } catch (error) {
    warning(`Error checking wayback status for ${url}: ${error}`);
  }
}
