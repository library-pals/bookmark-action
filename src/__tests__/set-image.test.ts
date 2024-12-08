import pen15 from "./fixtures/pen15.json";
import soup from "./fixtures/slow-cooker-soup.json";
import { setImage } from "../set-image";
import { warning, exportVariable } from "@actions/core";

jest.mock("open-graph-scraper");
jest.mock("fs", () => ({
  promises: {
    access: jest.fn(),
  },
}));
jest.mock("@actions/core", () => ({
  warning: jest.fn().mockResolvedValue(undefined),
  exportVariable: jest.fn().mockResolvedValue(undefined),
}));

describe("setImage", () => {
  test("set image without type", async () => {
    expect(await setImage(pen15)).toEqual("bookmark-pen15.jpg");
  });

  test("set image with type", async () => {
    expect(await setImage(soup)).toEqual(
      "bookmark-slow-cooker-cauliflower-potato-and-white-bean-soup-recipe.jpg"
    );
  });

  test("skip, if no title", async () => {
    expect(
      await setImage({
        ogImage: {
          url: "my-image.jpg",
        },
      })
    ).toBeUndefined();
    expect(warning).toHaveBeenCalledWith(
      "Unable to get a thumbnail image for this bookmark"
    );
  });

  test("skip, if no ogImage", async () => {
    expect(
      await setImage({
        ogTitle: "Good soup",
        ogImage: {
          type: "jpg",
        },
      })
    ).toBeUndefined();
    expect(warning).toHaveBeenCalledWith(
      "Unable to get a thumbnail image for this bookmark"
    );
  });

  test("image is invalid", async () => {
    expect(
      await setImage({
        ogTitle: "Good soup",
        ogImage: {
          url: "my-image.jpg",
          type: "jpg",
        },
      })
    ).toBeUndefined();
    expect(warning).toHaveBeenCalledWith(
      "Unable to access image my-image.jpg: Invalid URL"
    );
  });

  test("handle mime type, jpeg", async () => {
    expect(
      await setImage({
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

  test("handle mime type, jpg", async () => {
    expect(
      await setImage({
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

  test("handle unmatched mime type", async () => {
    expect(
      await setImage({
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
