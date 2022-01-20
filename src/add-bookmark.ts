import { readFileSync } from "fs";
import { load } from "js-yaml";
import { Bookmark } from "./utils";

export function addBookmark(fileName: string, bookmark: Bookmark): Bookmark[] {
  const bookmarks = load(readFileSync(fileName, "utf-8")) as Bookmark[];
  return [...(bookmarks ? [...bookmarks] : []), bookmark].sort(
    (a: Bookmark, b: Bookmark) =>
      new Date(a.date).valueOf() - new Date(b.date).valueOf()
  );
}
