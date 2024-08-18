import { action } from "..";
import * as github from "@actions/github";
import * as core from "@actions/core";
import { exportVariable, setFailed } from "@actions/core";
import pen15 from "./fixtures/pen15.json";
import jsn from "./fixtures/jsnmrs.json";
import ogs from "open-graph-scraper";
import { promises } from "fs";

jest.mock("@actions/core");
jest.mock("open-graph-scraper");
jest.mock("node-fetch");

import fetch from "node-fetch";
const { Response } = jest.requireActual("node-fetch");

// h/t https://github.com/actions/toolkit/issues/71#issuecomment-984111601
// Shallow clone original @actions/github context
const originalContext = { ...github.context };
afterEach(() => {
  Object.defineProperty(github, "context", {
    value: originalContext,
  });
});

beforeEach(() => {
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
});

describe("bookmark", () => {
  test("works", async () => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date("2022-09-11T13:30:00Z").getTime());

    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            url: "https://katydecorah.com",
            notes: "note",
          },
        },
      },
    });

    ogs.mockResolvedValueOnce({ result: pen15 });
    jest.spyOn(core, "getInput").mockImplementation((v) => {
      switch (v) {
        case "filename":
          return "_data/recipes.json";
        case "export-image":
          return "true";
        default:
          return "";
      }
    });
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
    "url": "https://cooking.nytimes.com/recipes/1021663-cornmeal-lime-shortbread-fans",
    "timestamp": "2021-01-03T00:00:00.000Z"
  },
  {
    "title": "Mini Meatball Soup With Broccoli and Orecchiette Recipe",
    "site": "NYT Cooking",
    "date": "2022-03-27",
    "url": "https://cooking.nytimes.com/recipes/1021568-mini-meatball-soup-with-broccoli-and-orecchiette",
    "timestamp": "2022-03-27T00:00:00.000Z"
  },
  {
    "title": "PEN15",
    "site": "Hulu",
    "author": "",
    "date": "2022-09-11",
    "timestamp": "2022-09-11T13:30:00.000Z",
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

  test("works, author", async () => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date("2022-09-11T13:30:00Z").getTime());

    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            url: "https://jasonmorris.com",
          },
        },
      },
    });

    ogs.mockResolvedValueOnce({ result: jsn });
    jest.spyOn(core, "getInput").mockImplementation((v) => {
      switch (v) {
        case "filename":
          return "_data/sites.json";
        case "export-image":
          return "true";
        default:
          return "";
      }
    });
    jest.spyOn(promises, "readFile").mockResolvedValueOnce(JSON.stringify([]));
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
  "_data/sites.json",
  "[
  {
    "title": "Jason Morris",
    "site": "",
    "author": "Jason Morris",
    "date": "2022-09-11",
    "timestamp": "2022-09-11T13:30:00.000Z",
    "description": "This is the personal website of Jason Morris — an accessibility engineer and a dialer from upstate New York",
    "url": "https://jasonmorris.com/",
    "type": "",
    "waybackUrl": "https://web.archive.org/web/20210101000000/https://example.com"
  }
]",
  "utf-8",
]
`);
  });

  test("works, additional properties", async () => {
    jest
      .useFakeTimers()
      .setSystemTime(new Date("2022-09-11T13:30:00Z").getTime());

    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            url: "https://katydecorah.com",
            notes: "note",
            prop1: "my property",
            anotherProp: "another property",
          },
        },
      },
    });

    ogs.mockResolvedValueOnce({ result: pen15 });
    jest.spyOn(core, "getInput").mockImplementation((v) => {
      switch (v) {
        case "filename":
          return "_data/recipes.json";
        case "additional-properties":
          return "prop1, anotherProp";
        case "export-image":
          return "true";
        default:
          return "";
      }
    });
    jest.spyOn(promises, "readFile").mockResolvedValueOnce(JSON.stringify([]));
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
    "title": "PEN15",
    "site": "Hulu",
    "author": "",
    "date": "2022-09-11",
    "timestamp": "2022-09-11T13:30:00.000Z",
    "description": "PEN15 is middle school as it really happened. Maya Erskine and Anna Konkle star in this adult comedy, playing versions of themselves as thirteen-year-old outcasts in the year 2000, surrounded by actual thirteen-year-olds, where the best day of your life can turn into your worst with the stroke of a gel pen.",
    "url": "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
    "image": "bookmark-pen15.jpg",
    "type": "tv_show",
    "notes": "note",
    "prop1": "my property",
    "anotherProp": "another property"
  }
]",
  "utf-8",
]
`);
  });

  test("cannot get bookmarks", async () => {
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
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
    Object.defineProperty(github, "context", {});
    await action();
    expect(setFailed).toHaveBeenCalledWith("Missing `inputs`");
  });
  test("throws, missing url", async () => {
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            date: "2022-09-10",
          },
        },
      },
    });
    await action();
    expect(setFailed).toHaveBeenCalledWith("Missing `url` in payload");
  });
  test("throws, invalid url", async () => {
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
            url: "boop",
          },
        },
      },
    });
    await action();
    expect(setFailed).toHaveBeenCalledWith('The `url` "boop" is not valid');
  });
  test("throws, invalid date", async () => {
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
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
    Object.defineProperty(github, "context", {
      value: {
        payload: {
          inputs: {
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
