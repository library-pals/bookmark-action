import { action } from "..";
import * as github from "@actions/github";
import * as core from "@actions/core";
import { exportVariable, setFailed } from "@actions/core";
import pen15 from "./fixtures/pen15.json";
import ogs from "open-graph-scraper";
import { promises } from "fs";

jest.mock("@actions/core");
jest.mock("open-graph-scraper");

// h/t https://github.com/actions/toolkit/issues/71#issuecomment-984111601
// Shallow clone original @actions/github context
const originalContext = { ...github.context };
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
          client_payload: {
            url: "https://katydecorah.com",
            notes: "note",
          },
        },
      },
    });

    ogs.mockResolvedValueOnce({ result: pen15 });
    jest.spyOn(core, "getInput").mockImplementation(() => "_data/recipes.json");
    jest.spyOn(promises, "readFile").mockResolvedValueOnce(
      JSON.stringify([
        {
          title: "Cornmeal Lime Shortbread Fans Recipe",
          site: "NYT Cooking",
          date: "2021-01-03",
          url: "https://cooking.nytimes.com/recipes/1021663-cornmeal-lime-shortbread-fans",
        },
        {
          title: "Mini Meatball Soup With Broccoli and Orecchiette Recipe",
          site: "NYT Cooking",
          date: "2022-03-27",
          url: "https://cooking.nytimes.com/recipes/1021568-mini-meatball-soup-with-broccoli-and-orecchiette",
        },
      ])
    );
    const writeFileSpy = jest.spyOn(promises, "writeFile").mockImplementation();

    await action();
    expect(exportVariable).toHaveBeenNthCalledWith(
      1,
      "DateBookmarked",
      new Date().toISOString().slice(0, 10)
    );
    expect(setFailed).not.toHaveBeenCalled();
    expect(writeFileSpy.mock.calls[0]).toMatchInlineSnapshot(`
      [
        "_data/recipes.json",
        "[
        {
          "title": "Cornmeal Lime Shortbread Fans Recipe",
          "site": "NYT Cooking",
          "date": "2021-01-03",
          "url": "https://cooking.nytimes.com/recipes/1021663-cornmeal-lime-shortbread-fans"
        },
        {
          "title": "Mini Meatball Soup With Broccoli and Orecchiette Recipe",
          "site": "NYT Cooking",
          "date": "2022-03-27",
          "url": "https://cooking.nytimes.com/recipes/1021568-mini-meatball-soup-with-broccoli-and-orecchiette"
        },
        {
          "title": "PEN15",
          "site": "Hulu",
          "date": "2022-09-11",
          "description": "PEN15 is middle school as it really happened. Maya Erskine and Anna Konkle star in this adult comedy, playing versions of themselves as thirteen-year-old outcasts in the year 2000, surrounded by actual thirteen-year-olds, where the best day of your life can turn into your worst with the stroke of a gel pen.",
          "url": "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
          "image": "bookmark-pen15.jpg",
          "type": "tv_show",
          "notes": "note"
        }
      ]",
        "utf-8",
      ]
    `);
  });

  test("cannot get bookmarks", async () => {
    // eslint-disable-next-line no-import-assign
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          client_payload: {
            url: "https://katydecorah.com",
            notes: "note",
          },
        },
      },
    });

    ogs.mockResolvedValueOnce({ result: pen15 });
    jest.spyOn(core, "getInput").mockImplementation(() => "_data/recipes.json");
    jest
      .spyOn(promises, "readFile")
      .mockRejectedValueOnce({ message: "Error" });

    await action();
    expect(exportVariable).toHaveBeenNthCalledWith(
      1,
      "DateBookmarked",
      new Date().toISOString().slice(0, 10)
    );
    expect(setFailed).toHaveBeenNthCalledWith(1, "Error");
    expect(setFailed).toHaveBeenNthCalledWith(2, "Unable to add bookmark");
  });

  test("throws, can't get issue", async () => {
    // eslint-disable-next-line no-import-assign
    Object.defineProperty(github, "context", {});
    await action();
    expect(setFailed).toHaveBeenCalledWith("Missing `client_payload`");
  });
  test("throws, missing url", async () => {
    // eslint-disable-next-line no-import-assign
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          client_payload: {
            date: "2022-09-10",
          },
        },
      },
    });
    await action();
    expect(setFailed).toHaveBeenCalledWith("Missing `url` in payload");
  });
  test("throws, invalid url", async () => {
    // eslint-disable-next-line no-import-assign
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          client_payload: {
            url: "boop",
          },
        },
      },
    });
    await action();
    expect(setFailed).toHaveBeenCalledWith('The `url` "boop" is not valid');
  });
  test("throws, invalid date", async () => {
    // eslint-disable-next-line no-import-assign
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          client_payload: {
            url: "https://google.com",
            date: "September 10 2022",
          },
        },
      },
    });
    await action();
    expect(setFailed).toHaveBeenCalledWith(
      'The `date` "September 10 2022" must be in YYYY-MM-DD format'
    );
  });
  test("throws, can't write file", async () => {
    // eslint-disable-next-line no-import-assign
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          client_payload: {
            url: "https://katydecorah.com",
            notes: "note",
          },
        },
      },
    });
    jest.spyOn(promises, "writeFile").mockRejectedValue();
    await action();
    expect(setFailed).toHaveBeenCalled();
  });
});
