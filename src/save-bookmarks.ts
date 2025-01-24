import { setFailed } from "@actions/core";
import { writeFile } from "fs/promises";
import { Bookmark } from "./add-bookmark.js";

export async function saveBookmarks({
  filename,
  bookmarks,
}: {
  filename: string;
  bookmarks: Bookmark[];
}) {
  try {
    return await writeFile(
      filename,
      JSON.stringify(bookmarks, null, 2),
      "utf-8"
    );
  } catch (error) {
    setFailed(error.message);
  }
}
