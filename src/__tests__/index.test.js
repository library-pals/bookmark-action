const bookmark = require("../index.js");

const github = require("@actions/github");
const core = require("@actions/core");

jest.mock("@actions/core");
jest.mock("fs");

// h/t https://github.com/actions/toolkit/issues/71#issuecomment-984111601
// Shallow clone original @actions/github context
let originalContext = { ...github.context };
// Restore original @actions/github context
afterEach(() => {
  Object.defineProperty(github, "context", {
    value: originalContext,
  });
});

describe("bookmark", () => {
  test("works", async () => {
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

    await bookmark();
    expect(core.exportVariable).toHaveBeenNthCalledWith(
      1,
      "DateBookmarked",
      new Date().toISOString().slice(0, 10)
    );
    expect(core.exportVariable).toHaveBeenNthCalledWith(2, "IssueNumber", 1);
  });

  test("throws", async () => {
    Object.defineProperty(github, "context", {});
    return expect(bookmark()).rejects.toThrow();
  });
});
