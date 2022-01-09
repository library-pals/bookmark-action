"use strict";

import { getInput, exportVariable } from "@actions/core";
import * as github from "@actions/github";
import {
  titleParser,
  getMetadata,
  addBookmark,
  saveBookmarks,
  Bookmark,
} from "./utils.js";

export default async function action() {
  try {
    if (!github.context.payload.issue) {
      throw new Error("Cannot find GitHub issue");
    }
    const { title, number, body } = github.context.payload.issue;
    const { url, date } = titleParser(title);
    if (!url) {
      throw new Error(`The url "${url}" is not valid`);
    }
    const fileName = getInput("fileName");
    exportVariable("IssueNumber", number);
    const page = (await getMetadata({ url, body, date })) as Bookmark;
    const bookmarks: Bookmark[] = addBookmark(fileName, page);
    await saveBookmarks(fileName, bookmarks);
  } catch (error) {
    throw new Error(error);
  }
}
