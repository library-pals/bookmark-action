import { exportVariable, getInput, setFailed } from "@actions/core";
import * as github from "@actions/github";
import { isUrl, isDate } from "./utils.js";
import { saveBookmarks } from "./save-bookmarks.js";
import { addBookmark, Bookmark } from "./add-bookmark.js";
import { getMetadata } from "./get-metadata.js";
import { setAdditionalProperties } from "./set-additional-properties.js";
import { createDates } from "./create-dates.js";

type Payload = {
  url: string;
  notes?: string;
  date?: string;
  tags?: string;
};

export async function action() {
  try {
    // Get inputs
    const payload: Payload = github.context.payload.inputs;

    // Validate inputs
    if (!payload) return setFailed("Missing `inputs`");
    if (!payload.url) return setFailed("Missing `url` in payload");

    const { url, notes, tags } = payload;

    if (!isUrl(url)) {
      return setFailed(`The \`url\` "${url}" is not valid`);
    }

    if (payload.date && !isDate(payload.date)) {
      return setFailed(
        `The \`date\` "${payload.date}" must be in YYYY-MM-DD format`
      );
    }
    const { shortDate, timestamp } = createDates(payload.date);
    exportVariable("DateBookmarked", shortDate);

    const filename = getInput("filename");
    const additionalProperties = setAdditionalProperties(payload);

    const page = (await getMetadata({
      url,
      notes,
      date: shortDate,
      timestamp,
      tags,
      additionalProperties,
    })) as Bookmark;
    const bookmarks = await addBookmark(filename, page);
    if (!bookmarks) {
      setFailed(`Unable to add bookmark`);
      return;
    }
    await saveBookmarks({ filename, bookmarks });
  } catch (error) {
    setFailed(error.message);
  }
}

export default action();
