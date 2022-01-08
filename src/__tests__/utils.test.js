const {
  setImage,
  getMetadata,
  titleParser,
  addBookmark,
  saveBookmarks,
} = require("../utils.js");
const pen15 = require("./fixtures/pen15.json");
const soup = require("./fixtures/slow-cooker-soup.json");
const ogs = require("open-graph-scraper");
const fs = require("fs");
const yaml = require("js-yaml");
const core = require("@actions/core");

jest.mock("open-graph-scraper");
jest.mock("fs");
jest.mock("@actions/core");

const newRecipe = {
  date: "2022-01-01",
  description:
    "This creamy vegetarian soup is built on humble winter staples, but the addition of sour cream and chives make it feel special (Crumble a few sour-cream-and-onion chips on top to take the theme all the way.) It takes just a few minutes to throw the ingredients into the slow cooker, and the rest of the recipe almost entirely hands-off, making it very doable on a weekday If you have one, use an immersion blender to purée it to a silky smooth consistency, but a potato masher works well for a textured, chunky soup",
  image:
    "bookmark-slow-cooker-cauliflower-potato-and-white-bean-soup-recipe.jpg",
  notes: "Delicious!",
  site: "NYT Cooking",
  title: "Slow-Cooker Cauliflower, Potato and White Bean Soup Recipe",
  type: "article",
  url: "https://cooking.nytimes.com/recipes/1022831-slow-cooker-cauliflower-potato-and-white-bean-soup",
};

describe("titleParser", () => {
  test("no date", () => {
    expect(
      titleParser(
        "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d"
      )
    ).toEqual({
      date: new Date().toISOString().slice(0, 10),
      url: "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
    });
  });
  test("with date", () => {
    expect(
      titleParser(
        "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d 2022-01-01"
      )
    ).toEqual({
      date: "2022-01-01",
      url: "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
    });
  });
  test("missing url", () => {
    titleParser("");
    expect(core.setFailed).toHaveBeenCalledWith(
      'The url "undefined" is not valid'
    );
  });
});

describe("addBookmark", () => {
  test("Add bookmark and sort by date", () => {
    jest.spyOn(fs, "readFileSync")
      .mockReturnValueOnce(`- title: Cornmeal Lime Shortbread Fans Recipe
  site: NYT Cooking
  date: '2021-01-03'
  url: https://cooking.nytimes.com/recipes/1021663-cornmeal-lime-shortbread-fans
- title: Mini Meatball Soup With Broccoli and Orecchiette Recipe
  site: NYT Cooking
  date: '2022-03-27'
  url: >-
    https://cooking.nytimes.com/recipes/1021568-mini-meatball-soup-with-broccoli-and-orecchiette`);

    expect(addBookmark("recipes.yml", newRecipe)).toMatchInlineSnapshot(`
      Array [
        Object {
          "date": "2021-01-03",
          "site": "NYT Cooking",
          "title": "Cornmeal Lime Shortbread Fans Recipe",
          "url": "https://cooking.nytimes.com/recipes/1021663-cornmeal-lime-shortbread-fans",
        },
        Object {
          "date": "2022-01-01",
          "description": "This creamy vegetarian soup is built on humble winter staples, but the addition of sour cream and chives make it feel special (Crumble a few sour-cream-and-onion chips on top to take the theme all the way.) It takes just a few minutes to throw the ingredients into the slow cooker, and the rest of the recipe almost entirely hands-off, making it very doable on a weekday If you have one, use an immersion blender to purée it to a silky smooth consistency, but a potato masher works well for a textured, chunky soup",
          "image": "bookmark-slow-cooker-cauliflower-potato-and-white-bean-soup-recipe.jpg",
          "notes": "Delicious!",
          "site": "NYT Cooking",
          "title": "Slow-Cooker Cauliflower, Potato and White Bean Soup Recipe",
          "type": "article",
          "url": "https://cooking.nytimes.com/recipes/1022831-slow-cooker-cauliflower-potato-and-white-bean-soup",
        },
        Object {
          "date": "2022-03-27",
          "site": "NYT Cooking",
          "title": "Mini Meatball Soup With Broccoli and Orecchiette Recipe",
          "url": "https://cooking.nytimes.com/recipes/1021568-mini-meatball-soup-with-broccoli-and-orecchiette",
        },
      ]
    `);
  });
});

describe("getMetadata", () => {
  test("tv show", async () => {
    ogs.mockResolvedValueOnce({ result: pen15 });
    expect(
      await getMetadata(
        "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
        "",
        "2022-01-01"
      )
    ).toMatchInlineSnapshot(`
      Object {
        "date": "2022-01-01",
        "description": "PEN15 is middle school as it really happened. Maya Erskine and Anna Konkle star in this adult comedy, playing versions of themselves as thirteen-year-old outcasts in the year 2000, surrounded by actual thirteen-year-olds, where the best day of your life can turn into your worst with the stroke of a gel pen.",
        "image": "bookmark-pen15.jpg",
        "site": "Hulu",
        "title": "PEN15",
        "type": "tv_show",
        "url": "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
      }
    `);
  });
  test("recipe, with note", async () => {
    ogs.mockResolvedValueOnce({ result: soup });
    expect(
      await getMetadata(
        "https://cooking.nytimes.com/recipes/1022831-slow-cooker-cauliflower-potato-and-white-bean-soup",
        "Delicious!",
        "2022-01-01"
      )
    ).toMatchInlineSnapshot(`
      Object {
        "date": "2022-01-01",
        "description": "This creamy vegetarian soup is built on humble winter staples, but the addition of sour cream and chives make it feel special (Crumble a few sour-cream-and-onion chips on top to take the theme all the way.) It takes just a few minutes to throw the ingredients into the slow cooker, and the rest of the recipe almost entirely hands-off, making it very doable on a weekday If you have one, use an immersion blender to purée it to a silky smooth consistency, but a potato masher works well for a textured, chunky soup",
        "image": "bookmark-slow-cooker-cauliflower-potato-and-white-bean-soup-recipe.jpg",
        "notes": "Delicious!",
        "site": "NYT Cooking",
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
    expect(
      await getMetadata(
        "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
        "",
        "2022-01-01"
      )
    ).toMatchInlineSnapshot(`
      Object {
        "date": "2022-01-01",
        "description": "PEN15 is middle school as it really happened. Maya Erskine and Anna Konkle star in this adult comedy, playing versions of themselves as thirteen-year-old outcasts in the year 2000, surrounded by actual thirteen-year-olds, where the best day of your life can turn into your worst with the stroke of a gel pen.",
        "image": "",
        "site": "Hulu",
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
    expect(
      await getMetadata(
        "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
        "",
        "2022-01-01"
      )
    ).toMatchInlineSnapshot(`
      Object {
        "date": "2022-01-01",
        "description": "PEN15 is middle school as it really happened. Maya Erskine and Anna Konkle star in this adult comedy, playing versions of themselves as thirteen-year-old outcasts in the year 2000, surrounded by actual thirteen-year-olds, where the best day of your life can turn into your worst with the stroke of a gel pen.",
        "image": "bookmark-pen15.jpg",
        "site": "Hulu",
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
    expect(
      await getMetadata(
        "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
        "",
        "2022-01-01"
      )
    ).toMatchInlineSnapshot(`
      Object {
        "date": "2022-01-01",
        "description": "",
        "image": "",
        "site": "",
        "title": "",
        "type": "tv_show",
        "url": "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
      }
    `);
  });
  test("throw error", async () => {
    ogs.mockResolvedValueOnce({ error: "Error!" });
    await getMetadata();
    expect(core.setFailed).toHaveBeenCalledWith("Error!");
  });
});

describe("setImage", () => {
  test("set image without type", () => {
    expect(setImage(pen15)).toEqual("bookmark-pen15.jpg");
  });

  test("set image with type", () => {
    expect(setImage(soup)).toEqual(
      "bookmark-slow-cooker-cauliflower-potato-and-white-bean-soup-recipe.jpg"
    );
  });

  test("skip, if no title", () => {
    expect(
      setImage({
        ogImage: {
          url: "my-image.jpg",
        },
      })
    ).toBeUndefined();
  });

  test("skip, if no ogImage", () => {
    expect(
      setImage({
        ogTitle: "Good soup",
        ogImage: {
          type: "jpg",
        },
      })
    ).toBeUndefined();
  });
});

describe("saveBookmarks", () => {
  test("works", async () => {
    const fileName = "my-file.yml";
    const bookmarks = `- title: bookmark1
- title: bookmark2`;
    await saveBookmarks(fileName, bookmarks);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      fileName,
      yaml.dump(bookmarks),
      "utf-8"
    );
  });
});
