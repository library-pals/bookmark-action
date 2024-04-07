import pen15 from "./fixtures/pen15.json";
import soup from "./fixtures/slow-cooker-soup.json";
import fullstack from "./fixtures/fullstackdev.json";
import ogs from "open-graph-scraper";
import { getMetadata } from "../get-metadata";
import * as core from "@actions/core";
import { createDates } from "../create-dates";

jest.mock("open-graph-scraper");
jest.mock("@actions/core");
jest.mock("node-fetch");

import fetch from "node-fetch";
const { Response } = jest.requireActual("node-fetch");

describe("getMetadata", () => {
  beforeEach(() => {
    jest.spyOn(core, "getInput").mockImplementation(() => "true");
    jest
      .useFakeTimers()
      .setSystemTime(new Date("2024-04-06T13:30:00Z").getTime());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("tv show", async () => {
    ogs.mockResolvedValueOnce({ result: pen15 });
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
    const { shortDate, timestamp } = createDates("2024-04-06");
    expect(
      await getMetadata({
        url: "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
        date: shortDate,
        timestamp,
        tags: "show,new",
      })
    ).toMatchInlineSnapshot(`
{
  "author": "",
  "date": "2024-04-06",
  "description": "PEN15 is middle school as it really happened. Maya Erskine and Anna Konkle star in this adult comedy, playing versions of themselves as thirteen-year-old outcasts in the year 2000, surrounded by actual thirteen-year-olds, where the best day of your life can turn into your worst with the stroke of a gel pen.",
  "image": "bookmark-pen15.jpg",
  "site": "Hulu",
  "tags": [
    "show",
    "new",
  ],
  "timestamp": "2024-04-06T13:30:00.000Z",
  "title": "PEN15",
  "type": "tv_show",
  "url": "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
}
`);
  });

  test("tv show, don't get image", async () => {
    const warningSpy = jest.spyOn(core, "warning");
    jest.spyOn(core, "getInput").mockImplementation(() => "false");
    ogs.mockResolvedValueOnce({ result: pen15 });
    const { shortDate, timestamp } = createDates("2024-04-06");
    expect(
      await getMetadata({
        url: "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
        date: shortDate,
        timestamp,
      })
    ).toMatchInlineSnapshot(`
{
  "author": "",
  "date": "2024-04-06",
  "description": "PEN15 is middle school as it really happened. Maya Erskine and Anna Konkle star in this adult comedy, playing versions of themselves as thirteen-year-old outcasts in the year 2000, surrounded by actual thirteen-year-olds, where the best day of your life can turn into your worst with the stroke of a gel pen.",
  "image": "",
  "site": "Hulu",
  "timestamp": "2024-04-06T13:30:00.000Z",
  "title": "PEN15",
  "type": "tv_show",
  "url": "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
}
`);
    expect(warningSpy).toHaveBeenCalledWith(
      "No wayback url found for https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d"
    );
  });
  test("fails", async () => {
    ogs.mockRejectedValueOnce({
      error: true,
      result: {
        success: false,
        requestUrl:
          "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
        error: "Page not found",
        errorDetails: new Error("Page not found"),
      },
    });
    const { shortDate, timestamp } = createDates("2024-04-06");
    await expect(
      getMetadata({
        url: "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
        date: shortDate,
        timestamp,
      })
    ).rejects.toMatchInlineSnapshot(
      `[Error: Error getting metadata for https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d: Page not found]`
    );
  });
  test("recipe, with note", async () => {
    ogs.mockResolvedValueOnce({ result: soup });
    const { shortDate, timestamp } = createDates("2024-04-06");
    expect(
      await getMetadata({
        url: "https://cooking.nytimes.com/recipes/1022831-slow-cooker-cauliflower-potato-and-white-bean-soup",
        notes: "Delicious!",
        date: shortDate,
        timestamp,
      })
    ).toMatchInlineSnapshot(`
{
  "author": "",
  "date": "2024-04-06",
  "description": "This creamy vegetarian soup is built on humble winter staples, but the addition of sour cream and chives make it feel special (Crumble a few sour-cream-and-onion chips on top to take the theme all the way.) It takes just a few minutes to throw the ingredients into the slow cooker, and the rest of the recipe almost entirely hands-off, making it very doable on a weekday If you have one, use an immersion blender to purée it to a silky smooth consistency, but a potato masher works well for a textured, chunky soup",
  "image": undefined,
  "notes": "Delicious!",
  "site": "NYT Cooking",
  "timestamp": "2024-04-06T13:30:00.000Z",
  "title": "Slow-Cooker Cauliflower, Potato and White Bean Soup Recipe",
  "type": "article",
  "url": "https://cooking.nytimes.com/recipes/1022831-slow-cooker-cauliflower-potato-and-white-bean-soup",
}
`);
  });
  test("tv show, no image", async () => {
    ogs.mockResolvedValueOnce({
      result: {
        ...pen15,
        ogImage: undefined,
      },
    });
    const { shortDate, timestamp } = createDates("2024-04-06");
    expect(
      await getMetadata({
        url: "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
        date: shortDate,
        timestamp,
      })
    ).toMatchInlineSnapshot(`
{
  "author": "",
  "date": "2024-04-06",
  "description": "PEN15 is middle school as it really happened. Maya Erskine and Anna Konkle star in this adult comedy, playing versions of themselves as thirteen-year-old outcasts in the year 2000, surrounded by actual thirteen-year-olds, where the best day of your life can turn into your worst with the stroke of a gel pen.",
  "image": undefined,
  "site": "Hulu",
  "timestamp": "2024-04-06T13:30:00.000Z",
  "title": "PEN15",
  "type": "tv_show",
  "url": "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
}
`);
  });
  test("tv show, no type", async () => {
    ogs.mockResolvedValueOnce({
      result: {
        ...pen15,
        ogType: undefined,
      },
    });
    const { shortDate, timestamp } = createDates("2024-04-06");
    expect(
      await getMetadata({
        url: "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
        date: shortDate,
        timestamp,
      })
    ).toMatchInlineSnapshot(`
{
  "author": "",
  "date": "2024-04-06",
  "description": "PEN15 is middle school as it really happened. Maya Erskine and Anna Konkle star in this adult comedy, playing versions of themselves as thirteen-year-old outcasts in the year 2000, surrounded by actual thirteen-year-olds, where the best day of your life can turn into your worst with the stroke of a gel pen.",
  "image": undefined,
  "site": "Hulu",
  "timestamp": "2024-04-06T13:30:00.000Z",
  "title": "PEN15",
  "type": "",
  "url": "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
}
`);
  });
  test("tv show, no title, site, or description", async () => {
    ogs.mockResolvedValueOnce({
      result: {
        ...pen15,
        ogTitle: undefined,
        ogSiteName: undefined,
        ogDescription: undefined,
      },
    });
    const { shortDate, timestamp } = createDates("2024-04-06");
    expect(
      await getMetadata({
        url: "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
        date: shortDate,
        timestamp,
      })
    ).toMatchInlineSnapshot(`
{
  "author": "",
  "date": "2024-04-06",
  "description": "",
  "image": undefined,
  "site": "",
  "timestamp": "2024-04-06T13:30:00.000Z",
  "title": "",
  "type": "tv_show",
  "url": "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
}
`);
  });
  test("bug fix, full stack dev", async () => {
    ogs.mockResolvedValueOnce({
      result: fullstack,
    });
    const { shortDate, timestamp } = createDates("2024-04-06");
    expect(
      await getMetadata({
        url: "https://thefullstackdev.net/article/create-beautiful-website-while-sucking-at-design/",
        date: shortDate,
        timestamp,
      })
    ).toMatchInlineSnapshot(`
{
  "author": "",
  "date": "2024-04-06",
  "description": "How to create great looking websites while having little design skill.",
  "image": undefined,
  "site": "",
  "timestamp": "2024-04-06T13:30:00.000Z",
  "title": "You can create a great looking website while sucking at design",
  "type": "",
  "url": "https://thefullstackdev.net/article/create-beautiful-website-while-sucking-at-design/",
}
`);
  });

  test("no result url", async () => {
    ogs.mockResolvedValueOnce({
      result: {
        ogTitle: "My title",
        ogLocale: "en",
        favicon: "/favicon.png",
        charset: "utf8",
        success: true,
      },
    });
    const { shortDate, timestamp } = createDates("2024-04-06");
    expect(
      await getMetadata({
        url: "https://website.gov",
        date: shortDate,
        timestamp,
      })
    ).toMatchInlineSnapshot(`
{
  "author": "",
  "date": "2024-04-06",
  "description": "",
  "image": undefined,
  "site": "",
  "timestamp": "2024-04-06T13:30:00.000Z",
  "title": "My title",
  "type": "",
  "url": "https://website.gov",
}
`);
  });
});
