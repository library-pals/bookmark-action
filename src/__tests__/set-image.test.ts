import pen15 from "./fixtures/pen15.json";
import soup from "./fixtures/slow-cooker-soup.json";
import { setImage } from "../set-image";
import { exportVariable } from "@actions/core";

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

  test("handle mime type", () => {
    expect(
      setImage({
        ogTitle: "The Best Chia Pudding Recipe - 5 Delicious Flavors!",
        ogImage: {
          url: "https://chocolatecoveredkatie.com/wp-content/uploads/2018/07/Vegan-Banana-Chia-Pudding.jpg",
          type: "image/jpeg",
        },
      })
    ).toEqual("bookmark-the-best-chia-pudding-recipe-5-delicious-flavors.jpg");
    expect(exportVariable).toHaveBeenNthCalledWith(
      1,
      "BookmarkImageOutput",
      "bookmark-the-best-chia-pudding-recipe-5-delicious-flavors.jpg"
    );
    expect(exportVariable).toHaveBeenNthCalledWith(
      2,
      "BookmarkImage",
      "https://chocolatecoveredkatie.com/wp-content/uploads/2018/07/Vegan-Banana-Chia-Pudding.jpg"
    );
  });

  test("handle mime type", () => {
    expect(
      setImage({
        ogTitle: "The Best Chia Pudding Recipe - 5 Delicious Flavors!",
        ogImage: {
          url: "https://chocolatecoveredkatie.com/wp-content/uploads/2018/07/Vegan-Banana-Chia-Pudding.jpg",
          type: "image/jpg",
        },
      })
    ).toEqual("bookmark-the-best-chia-pudding-recipe-5-delicious-flavors.jpg");
    expect(exportVariable).toHaveBeenNthCalledWith(
      1,
      "BookmarkImageOutput",
      "bookmark-the-best-chia-pudding-recipe-5-delicious-flavors.jpg"
    );
    expect(exportVariable).toHaveBeenNthCalledWith(
      2,
      "BookmarkImage",
      "https://chocolatecoveredkatie.com/wp-content/uploads/2018/07/Vegan-Banana-Chia-Pudding.jpg"
    );
  });

  test("handle unmatched mime type", () => {
    expect(
      setImage({
        ogTitle: "The Best Chia Pudding Recipe - 5 Delicious Flavors!",
        ogImage: {
          url: "https://chocolatecoveredkatie.com/wp-content/uploads/2018/07/Vegan-Banana-Chia-Pudding.jpg",
          type: "mp4",
        },
      })
    ).toEqual("bookmark-the-best-chia-pudding-recipe-5-delicious-flavors.jpg");
    expect(exportVariable).toHaveBeenNthCalledWith(
      1,
      "BookmarkImageOutput",
      "bookmark-the-best-chia-pudding-recipe-5-delicious-flavors.jpg"
    );
    expect(exportVariable).toHaveBeenNthCalledWith(
      2,
      "BookmarkImage",
      "https://chocolatecoveredkatie.com/wp-content/uploads/2018/07/Vegan-Banana-Chia-Pudding.jpg"
    );
  });
});
