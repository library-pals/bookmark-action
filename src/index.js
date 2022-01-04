"use strict";

const core = require("@actions/core");
const github = require("@actions/github");

const {
  titleParser,
  getMetadata,
  addBookmark,
  saveBookmarks,
} = require("./utils.js");

async function bookmark() {
  try {
    const { title, number, body } = github.context.payload.issue;
    const { url, date } = titleParser(title);
    const fileName = core.getInput("fileName");
    core.exportVariable("IssueNumber", number);
    const page = await getMetadata(url, body, date);
    const bookmarks = addBookmark(fileName, page);
    await saveBookmarks(fileName, bookmarks);
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = bookmark();
