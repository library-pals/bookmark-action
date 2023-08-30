import { warning } from "@actions/core";

export async function checkWaybackStatus(url: string): Promise<
  | {
      archived_snapshots: {
        closest?: {
          available: boolean;
          url: string;
          timestamp: string;
          status: string;
        };
      };
    }
  | undefined
> {
  try {
    const response = await fetch(
      `http://archive.org/wayback/available?url=${url}`
    );
    return await response.json();
  } catch (error) {
    warning(`Error checking wayback status for ${url}: ${error}`);
  }
}
