import { setFailed } from "@actions/core";
import { writeFile } from "fs/promises";
import { dump } from "js-yaml";
import { Bookmark } from "./utils";

export async function saveBookmarks({
  fileName,
  bookmarks,
}: {
  fileName: string;
  bookmarks: Bookmark[];
}) {
  try {
    const json = dump(bookmarks);
    return await writeFile(fileName, json, "utf-8");
  } catch (err) {
    setFailed(err.message);
  }
}
