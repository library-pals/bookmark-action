"use strict";

import { setFailed, getInput, exportVariable } from "@actions/core";
import github from "@actions/github";
import {
  titleParser,
  getMetadata,
  addBookmark,
  saveBookmarks,
  Bookmark,
} from "./utils.js";

export default async function main() {
  try {
    if (!github.context.payload.issue) {
      setFailed("Cannot find GitHub issue");
      return;
    }
    const { title, number, body } = github.context.payload.issue;
    const { url, date } = titleParser(title);
    if (!url) {
      setFailed("Cannot find url");
      return;
    }
    const fileName = getInput("fileName");
    exportVariable("IssueNumber", number);
    const page = (await getMetadata({ url, body, date })) as Bookmark;
    const bookmarks: Bookmark[] = addBookmark(fileName, page);
    await saveBookmarks(fileName, bookmarks);
  } catch (error) {
    setFailed(error);
  }
}
