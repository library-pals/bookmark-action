import bookmark from "../index.ts";
import * as github from "@actions/github";
import * as core from "@actions/core";
import pen15 from "./fixtures/pen15.json";
import ogs from "open-graph-scraper";

jest.mock("@actions/core");
jest.mock("fs");
jest.mock("open-graph-scraper");

// h/t https://github.com/actions/toolkit/issues/71#issuecomment-984111601
// Shallow clone original @actions/github context
let originalContext = { ...github.context };
afterEach(() => {
  // eslint-disable-next-line no-import-assign
  Object.defineProperty(github, "context", {
    value: originalContext,
  });
});

describe("bookmark", () => {
  test("works", async () => {
    // eslint-disable-next-line no-import-assign
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          issue: {
            title: "https://katydecorah.com",
            body: "note",
            number: 1,
          },
        },
      },
    });

    ogs.mockResolvedValueOnce({ result: pen15 });

    await bookmark();
    expect(core.exportVariable).toHaveBeenNthCalledWith(
      1,
      "DateBookmarked",
      new Date().toISOString().slice(0, 10)
    );
    expect(core.exportVariable).toHaveBeenNthCalledWith(2, "IssueNumber", 1);
  });

  test("throws", async () => {
    // eslint-disable-next-line no-import-assign
    Object.defineProperty(github, "context", {});
    return expect(bookmark()).rejects.toThrow();
  });

  test("throws, invalid url", async () => {
    // eslint-disable-next-line no-import-assign
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          issue: {
            title: "boop",
            number: 1,
          },
        },
      },
    });
    return expect(bookmark()).rejects.toThrow();
  });
});
