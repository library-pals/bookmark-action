import { promises } from "fs";
import { dump } from "js-yaml";
import { saveBookmarks } from "../save-bookmarks";

jest.mock("open-graph-scraper");
jest.mock("@actions/core");

describe("saveBookmarks", () => {
  test("works", async () => {
    const fileName = "my-file.yml";
    const bookmarks = `- title: bookmark1
- title: bookmark2`;
    const writeSpy = jest.spyOn(promises, "writeFile");
    await saveBookmarks({ fileName, bookmarks });
    expect(writeSpy).toHaveBeenCalledWith(fileName, dump(bookmarks), "utf-8");
  });
});
