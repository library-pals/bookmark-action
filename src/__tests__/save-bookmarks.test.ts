import { setFailed } from "@actions/core";
import { promises } from "fs";
import { saveBookmarks } from "../save-bookmarks";

jest.mock("open-graph-scraper");
jest.mock("@actions/core");

describe("saveBookmarks", () => {
  test("works", async () => {
    const fileName = "my-file.json";
    const bookmarks = [
      {
        title: "bookmark1",
      },
      {
        title: "bookmark2",
      },
    ];
    const writeSpy = jest.spyOn(promises, "writeFile").mockResolvedValueOnce();
    await saveBookmarks({ fileName, bookmarks });
    expect(writeSpy).toHaveBeenCalledWith(
      fileName,
      JSON.stringify(bookmarks, null, 2),
      "utf-8"
    );
  });
  test("fails", async () => {
    const fileName = "my-file.json";
    const bookmarks = [
      {
        title: "bookmark1",
      },
      {
        title: "bookmark2",
      },
    ];
    jest.spyOn(promises, "writeFile").mockRejectedValue({ message: "Error" });
    await saveBookmarks({ fileName, bookmarks });
    expect(setFailed).toHaveBeenCalledWith("Error");
  });
});
