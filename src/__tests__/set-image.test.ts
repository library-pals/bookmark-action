import pen15 from "./fixtures/pen15.json";
import soup from "./fixtures/slow-cooker-soup.json";
import { setImage } from "../set-image";

jest.mock("open-graph-scraper");
jest.mock("fs");
jest.mock("@actions/core");

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
