import { setFailed } from "@actions/core";
import { writeFile } from "fs/promises";
import { Bookmark } from "./add-bookmark";

export async function saveBookmarks({
  fileName,
  bookmarks,
}: {
  fileName: string;
  bookmarks: Bookmark[];
}) {
  try {
    return await writeFile(
      fileName,
      JSON.stringify(bookmarks, null, 2),
      "utf-8"
    );
  } catch (error) {
    setFailed(error.message);
  }
}
