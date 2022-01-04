const { setImage } = require("../utils.js");
const pen15 = require("./fixtures/pen15.json");
const soup = require("./fixtures/slow-cooker-soup.json");

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
