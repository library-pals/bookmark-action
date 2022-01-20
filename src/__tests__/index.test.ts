import { action } from "..";
import * as github from "@actions/github";
import { exportVariable, setFailed } from "@actions/core";
import pen15 from "./fixtures/pen15.json";
import ogs from "open-graph-scraper";
import fs from "fs";

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

    await action();
    expect(exportVariable).toHaveBeenNthCalledWith(
      1,
      "DateBookmarked",
      new Date().toISOString().slice(0, 10)
    );
    expect(exportVariable).toHaveBeenNthCalledWith(2, "IssueNumber", 1);
  });

  test("throws, can't get issue", async () => {
    // eslint-disable-next-line no-import-assign
    Object.defineProperty(github, "context", {});
    await action();
    expect(setFailed).toHaveBeenCalledWith("Cannot find GitHub issue");
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
    await action();
    expect(setFailed).toHaveBeenCalledWith('The url "undefined" is not valid');
  });
  test("throws, can't write file", async () => {
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
    jest.spyOn(fs, "writeFileSync").mockRejectedValue();
    await action();
    expect(setFailed).toHaveBeenCalled();
  });
});
