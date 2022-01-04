const core = require("@actions/core");
const { writeFileSync, readFileSync } = require("fs");
const ogs = require("open-graph-scraper");
const yaml = require("js-yaml");

async function getMetadata(url, body, date) {
  return ogs({ url }).then((data) => {
    const { error, result } = data;
    const { ogUrl, ogTitle, ogDescription, ogSiteName, ogType } = result;
    if (error) throw new Error(result);
    core.exportVariable("BookmarkTitle", ogTitle);
    core.exportVariable("DateBookmarked", date);
    const image = setImage(result);
    return {
      title: ogTitle || "",
      site: ogSiteName || "",
      date,
      description: ogDescription || "",
      url: ogUrl,
      image: image || "",
      type: ogType || "",
      ...(body && { notes: body }),
    };
  });
}

function addBookmark(fileName, bookmark) {
  return [...yaml.load(readFileSync(fileName, "utf-8")), bookmark].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
}

async function saveBookmarks(fileName, bookmark) {
  try {
    writeFileSync(fileName, yaml.dump(bookmark), "utf-8");
  } catch (error) {
    core.setFailed(error.message);
  }
}

function setImage({ ogImage, ogTitle }) {
  if (!ogImage || !ogImage.url || !ogTitle) return;
  const imageType = ogImage.type ? `.${ogImage.type}` : ".jpg";
  const image = `bookmark-${slugify(ogTitle)}${imageType}`;
  core.exportVariable("BookmarkImageOutput", image);
  core.exportVariable("BookmarkImage", ogImage.url);
  return image;
}

// Credit: https://gist.github.com/mathewbyrne/1280286
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function titleParser(title) {
  const split = title.split(" ");
  const url = isUrl(split[0]) ? split[0] : undefined;
  if (!url) core.setFailed(`${url} is not valid`);
  const date = isDate(split[1])
    ? split[1]
    : new Date().toISOString().slice(0, 10);
  core.exportVariable("DateBookmarked", date);
  return {
    url,
    date,
  };
}

// make sure date is in YYYY-MM-DD format
const dateFormat = (date) => date.match(/^\d{4}-\d{2}-\d{2}$/) != null;
// make sure date value is a date
const isDate = (date) => !isNaN(Date.parse(date)) && dateFormat(date);
const isUrl = (url) => url.startsWith("http");

module.exports = {
  getMetadata,
  addBookmark,
  saveBookmarks,
  setImage,
  titleParser,
};
