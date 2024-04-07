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
    const formatedBookmarks = formatBookmarks(currentJson);
    return [...formatedBookmarks, bookmark].sort(
      (a: Bookmark, b: Bookmark) =>
        new Date(a.timestamp).valueOf() - new Date(b.timestamp).valueOf()
    );
  } catch (error) {
    setFailed(error.message);
  }
}

function formatBookmarks(bookmarks: Bookmark[] | []) {
  if (!bookmarks.length) return [];

  for (let i = 0; i < bookmarks.length; i++) {
    if (!bookmarks[i].timestamp) {
      bookmarks[i].timestamp = new Date(bookmarks[i].date).toISOString();
    }
  }

  return bookmarks;
}

export type Bookmark = {
  title: string;
  site: string;
  date: string;
  timestamp: string;
  description: string;
  url: string;
  author: string;
  type: string;
  image?: string;
  notes?: string;
  tags?: string[];
};
