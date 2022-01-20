import { promises } from "fs";
import { addBookmark } from "../add-bookmark";

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

describe("addBookmark", () => {
  test("Add bookmark and sort by date", async () => {
    jest.spyOn(promises, "readFile")
      .mockResolvedValueOnce(`- title: Cornmeal Lime Shortbread Fans Recipe
  site: NYT Cooking
  date: '2021-01-03'
  url: https://cooking.nytimes.com/recipes/1021663-cornmeal-lime-shortbread-fans
- title: Mini Meatball Soup With Broccoli and Orecchiette Recipe
  site: NYT Cooking
  date: '2022-03-27'
  url: >-
    https://cooking.nytimes.com/recipes/1021568-mini-meatball-soup-with-broccoli-and-orecchiette`);

    expect(await addBookmark("recipes.yml", newRecipe)).toMatchInlineSnapshot(`
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
  test("Add to empty file", async () => {
    jest.spyOn(promises, "readFile").mockResolvedValueOnce("");
    expect(await addBookmark("recipes.yml", newRecipe)).toMatchInlineSnapshot(`
      Array [
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
      ]
    `);
  });
});
