import { checkWaybackStatus } from "../wayback";
import * as core from "@actions/core";

jest.mock("node-fetch");
jest.mock("@actions/core");

import fetch from "node-fetch";
const { Response } = jest.requireActual("node-fetch");

describe("checkWaybackStatus", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns undefined when the URL is not archived", async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({});
    const result = await checkWaybackStatus("https://example.com");

    expect(result).toBeUndefined();
    expect(fetch).toHaveBeenCalledWith(
      "https://archive.org/wayback/available?url=https://example.com"
    );
  });

  it("returns the closest snapshot when the URL is archived", async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      Promise.resolve(
        new Response(
          JSON.stringify({
            archived_snapshots: {
              closest: {
                available: true,
                url: "https://web.archive.org/web/20210101000000/https://example.com",
                timestamp: "20210101000000",
                status: "200",
              },
            },
          })
        )
      )
    );

    const result = await checkWaybackStatus("https://example.com");

    expect(result).toEqual({
      archived_snapshots: {
        closest: {
          available: true,
          url: "https://web.archive.org/web/20210101000000/https://example.com",
          timestamp: "20210101000000",
          status: "200",
        },
      },
    });
    expect(fetch).toHaveBeenCalledWith(
      "https://archive.org/wayback/available?url=https://example.com"
    );
  });

  it("handles errors gracefully", async () => {
    const warningSpy = jest.spyOn(core, "warning");

    (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(
      new Error("Network error")
    );

    const result = await checkWaybackStatus("https://example.com");

    expect(result).toBeUndefined();
    expect(warningSpy).toHaveBeenCalledWith(
      "Error checking wayback status for https://example.com: Error: Network error"
    );
  });
});
