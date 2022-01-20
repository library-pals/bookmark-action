import { getInput, exportVariable, setFailed } from "@actions/core";
import * as github from "@actions/github";
import { titleParser } from "./utils.js";
import { saveBookmarks } from "./save-bookmarks";
import { addBookmark, Bookmark } from "./add-bookmark";
import { getMetadata } from "./get-metadata";

export async function action() {
  try {
    if (!github.context.payload.issue) {
      setFailed("Cannot find GitHub issue");
      return;
    }
    const { title, number, body } = github.context.payload.issue;
    const { url, date } = titleParser(title);
    if (!url) {
      setFailed(`The url "${url}" is not valid`);
      return;
    }
    const fileName = getInput("fileName");
    exportVariable("IssueNumber", number);
    const page = (await getMetadata({ url, body, date })) as Bookmark;
    const bookmarks = await addBookmark(fileName, page);
    if (!bookmarks) {
      setFailed(`Unable to add bookmark`);
      return;
    }
    await saveBookmarks({ fileName, bookmarks });
  } catch (error) {
    setFailed(error.message);
  }
}

export default action();
