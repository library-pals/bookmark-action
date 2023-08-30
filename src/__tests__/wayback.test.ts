import { warning } from "@actions/core";
import { checkWaybackStatus } from "../wayback";

jest.mock("@actions/core");

describe("checkWaybackStatus", () => {
  it("returns an empty archived_snapshots object when the URL is not archived", async () => {
    const result = await checkWaybackStatus("https://blorp.gov");
    expect(result).toMatchInlineSnapshot(`
{
  "archived_snapshots": {},
  "url": "https://blorp.gov",
}
`);
  });

  it("returns the closest snapshot when the URL is archived", async () => {
    const result = await checkWaybackStatus("https://katydecorah.com");
    expect(result).toMatchInlineSnapshot(`
{
  "archived_snapshots": {
    "closest": {
      "available": true,
      "status": "200",
      "timestamp": "20230602134158",
      "url": "http://web.archive.org/web/20230602134158/https://katydecorah.com/",
    },
  },
  "url": "https://katydecorah.com",
}
`);
  });

  it("handles errors", async () => {
    jest.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

    const result = await checkWaybackStatus("https://example.com");

    expect(result).toBeUndefined();
    expect(warning).toHaveBeenCalledWith(
      "Error checking wayback status for https://example.com: Error: Network error"
    );
  });
});
