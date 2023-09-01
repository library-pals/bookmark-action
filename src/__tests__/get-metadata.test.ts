import pen15 from "./fixtures/pen15.json";
import soup from "./fixtures/slow-cooker-soup.json";
import fullstack from "./fixtures/fullstackdev.json";
import ogs from "open-graph-scraper";
import { getMetadata } from "../get-metadata";
import * as core from "@actions/core";

jest.mock("open-graph-scraper");
jest.mock("@actions/core");
jest.mock("node-fetch");

import fetch from "node-fetch";
const { Response } = jest.requireActual("node-fetch");

describe("getMetadata", () => {
  beforeEach(() => {
    jest.spyOn(core, "getInput").mockImplementation(() => "true");
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
  test("tv show", async () => {
    ogs.mockResolvedValueOnce({ result: pen15 });
    expect(
  await getMetadata({
    url: "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
    date: "2022-01-01",
    tags: "show,new"
  })
).toMatchInlineSnapshot(`
{
  "author": "",
  "date": "2022-01-01",
  "description": "PEN15 is middle school as it really happened. Maya Erskine and Anna Konkle star in this adult comedy, playing versions of themselves as thirteen-year-old outcasts in the year 2000, surrounded by actual thirteen-year-olds, where the best day of your life can turn into your worst with the stroke of a gel pen.",
  "image": "bookmark-pen15.jpg",
  "site": "Hulu",
  "tags": [
    "show",
    "new",
  ],
  "title": "PEN15",
  "type": "tv_show",
  "url": "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
  "waybackUrl": "https://web.archive.org/web/20210101000000/https://example.com",
}
`);
  });

  test("tv show, don't get image", async () => {
    jest.spyOn(core, "getInput").mockImplementation(() => "false");
    ogs.mockResolvedValueOnce({ result: pen15 });
    expect(
  await getMetadata({
    url: "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",

    date: "2022-01-01"
  })
).toMatchInlineSnapshot(`
{
  "author": "",
  "date": "2022-01-01",
  "description": "PEN15 is middle school as it really happened. Maya Erskine and Anna Konkle star in this adult comedy, playing versions of themselves as thirteen-year-old outcasts in the year 2000, surrounded by actual thirteen-year-olds, where the best day of your life can turn into your worst with the stroke of a gel pen.",
  "image": "",
  "site": "Hulu",
  "title": "PEN15",
  "type": "tv_show",
  "url": "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
  "waybackUrl": "https://web.archive.org/web/20210101000000/https://example.com",
}
`);
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

    await expect(
      getMetadata({
        url: "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
        date: "2022-01-01",
      })
    ).rejects.toMatchInlineSnapshot(
      `[Error: Error getting metadata for https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d: Page not found]`
    );
  });
  test("recipe, with note", async () => {
    ogs.mockResolvedValueOnce({ result: soup });
    expect(
  await getMetadata({
    url: "https://cooking.nytimes.com/recipes/1022831-slow-cooker-cauliflower-potato-and-white-bean-soup",
    notes: "Delicious!",
    date: "2022-01-01"
  })
).toMatchInlineSnapshot(`
{
  "author": "",
  "date": "2022-01-01",
  "description": "This creamy vegetarian soup is built on humble winter staples, but the addition of sour cream and chives make it feel special (Crumble a few sour-cream-and-onion chips on top to take the theme all the way.) It takes just a few minutes to throw the ingredients into the slow cooker, and the rest of the recipe almost entirely hands-off, making it very doable on a weekday If you have one, use an immersion blender to purée it to a silky smooth consistency, but a potato masher works well for a textured, chunky soup",
  "image": "bookmark-slow-cooker-cauliflower-potato-and-white-bean-soup-recipe.jpg",
  "notes": "Delicious!",
  "site": "NYT Cooking",
  "title": "Slow-Cooker Cauliflower, Potato and White Bean Soup Recipe",
  "type": "article",
  "url": "https://cooking.nytimes.com/recipes/1022831-slow-cooker-cauliflower-potato-and-white-bean-soup",
  "waybackUrl": "https://web.archive.org/web/20210101000000/https://example.com",
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
    expect(
  await getMetadata({
    url: "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
    date: "2022-01-01"
  })
).toMatchInlineSnapshot(`
{
  "author": "",
  "date": "2022-01-01",
  "description": "PEN15 is middle school as it really happened. Maya Erskine and Anna Konkle star in this adult comedy, playing versions of themselves as thirteen-year-old outcasts in the year 2000, surrounded by actual thirteen-year-olds, where the best day of your life can turn into your worst with the stroke of a gel pen.",
  "image": undefined,
  "site": "Hulu",
  "title": "PEN15",
  "type": "tv_show",
  "url": "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
  "waybackUrl": "https://web.archive.org/web/20210101000000/https://example.com",
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
    expect(
  await getMetadata({
    url: "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
    date: "2022-01-01"
  })
).toMatchInlineSnapshot(`
{
  "author": "",
  "date": "2022-01-01",
  "description": "PEN15 is middle school as it really happened. Maya Erskine and Anna Konkle star in this adult comedy, playing versions of themselves as thirteen-year-old outcasts in the year 2000, surrounded by actual thirteen-year-olds, where the best day of your life can turn into your worst with the stroke of a gel pen.",
  "image": "bookmark-pen15.jpg",
  "site": "Hulu",
  "title": "PEN15",
  "type": "",
  "url": "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
  "waybackUrl": "https://web.archive.org/web/20210101000000/https://example.com",
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
    expect(
  await getMetadata({
    url: "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
    date: "2022-01-01"
  })
).toMatchInlineSnapshot(`
{
  "author": "",
  "date": "2022-01-01",
  "description": "",
  "image": undefined,
  "site": "",
  "title": "",
  "type": "tv_show",
  "url": "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
  "waybackUrl": "https://web.archive.org/web/20210101000000/https://example.com",
}
`);
  });
  test("bug fix, full stack dev", async () => {
    ogs.mockResolvedValueOnce({
      result: fullstack,
    });
    expect(
  await getMetadata({
    url: "https://thefullstackdev.net/article/create-beautiful-website-while-sucking-at-design/",
    date: "2022-08-03"
  })
).toMatchInlineSnapshot(`
{
  "author": "",
  "date": "2022-08-03",
  "description": "How to create great looking websites while having little design skill.",
  "image": "bookmark-you-can-create-a-great-looking-website-while-sucking-at-design.png",
  "site": "",
  "title": "You can create a great looking website while sucking at design",
  "type": "",
  "url": "https://thefullstackdev.net/article/create-beautiful-website-while-sucking-at-design/",
  "waybackUrl": "https://web.archive.org/web/20210101000000/https://example.com",
}
`);
  });
});
