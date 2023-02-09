import { setFailed } from "@actions/core";
import { readFile } from "fs/promises";

export async function addBookmark(
  filename: string,
  bookmark: Bookmark
): Promise<Bookmark[] | undefined> {
  try {
    const currentBookmarks = await readFile(filename, "utf-8");
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
  author: string;
  type: string;
  image?: string;
  notes?: string;
  tags?: string[];
};
