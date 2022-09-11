import { setFailed } from "@actions/core";
import { readFile } from "fs/promises";

export async function addBookmark(
  fileName: string,
  bookmark: Bookmark
): Promise<Bookmark[] | undefined> {
  try {
    const currentBookmarks = await readFile(fileName, "utf-8");
    const currentJson = currentBookmarks
      ? (JSON.parse(currentBookmarks) as Bookmark[])
      : [];
    return [...currentJson, bookmark].sort(
      (a: Bookmark, b: Bookmark) =>
        new Date(a.date).valueOf() - new Date(b.date).valueOf()
    );
  } catch (error) {
    setFailed(error.message);
  }
}

export type Bookmark = {
  title: string;
  site: string;
  date: string;
  description: string;
  url: string;
  image?: string;
  notes?: string;
};
