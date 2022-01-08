const bookmark = require("../index.js");

const github = require("@actions/github");
const core = require("@actions/core");

jest.mock("@actions/core");
jest.mock("fs");

// h/t https://github.com/actions/toolkit/issues/71#issuecomment-984111601

// Shallow clone original @actions/github context
let originalContext = { ...github.context };

afterEach(() => {
  // Restore original @actions/github context
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
      "2022-01-08"
    );
    expect(core.exportVariable).toHaveBeenNthCalledWith(2, "IssueNumber", 1);
  });

  test("throws", async () => {
    Object.defineProperty(github, "context", {});
    return expect(bookmark()).rejects.toMatchInlineSnapshot(
      `[Error: TypeError: Cannot destructure property 'title' of '((cov_1qqxuk29du(...).s[4]++) , github.context.payload.issue)' as it is undefined.]`
    );
  });
});
