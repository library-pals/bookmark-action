import { exportVariable } from "@actions/core";
import { writeFileSync, readFileSync } from "fs";
import ogs from "open-graph-scraper";
import { load, dump } from "js-yaml";

export type Bookmark = {
  title: string;
  site: string;
  date: string;
  description: string;
  url: string;
  image?: string;
  notes?: string;
};

export type OpenGraphObject = {
  ogTitle: string;
  ogSiteName: string;
  ogDescription: string;
  ogUrl: string;
  ogType: string;
  success: boolean;
};

export async function getMetadata({
  url,
  body,
  date,
}: {
  url: string;
  body?: string;
  date: string;
}) {
  const { result } = (await ogs({ url })) as { result: OpenGraphObject };
  exportVariable("BookmarkTitle", result.ogTitle);
  exportVariable("DateBookmarked", date);
  const image = setImage(result);
  return {
    title: result.ogTitle || "",
    site: result.ogSiteName || "",
    date,
    description: result.ogDescription || "",
    url: result.ogUrl,
    image: image || "",
    type: result.ogType || "",
    ...(body && { notes: body }),
  };
}

export function addBookmark(fileName: string, bookmark: Bookmark) {
  const bookmarks = load(readFileSync(fileName, "utf-8")) as Bookmark[];
  return [...bookmarks, bookmark].sort(
    (a: Bookmark, b: Bookmark) =>
      new Date(a.date).valueOf() - new Date(b.date).valueOf()
  );
}

export async function saveBookmarks(fileName: string, bookmarks: Bookmark[]) {
  const json = dump(bookmarks);
  writeFileSync(fileName, json, "utf-8");
}

export function setImage(result) {
  if (!result.ogImage || !result.ogImage.url || !result.ogTitle) return;
  const imageType = result.ogImage.type ? `.${result.ogImage.type}` : ".jpg";
  const image = `bookmark-${slugify(result.ogTitle)}${imageType}`;
  exportVariable("BookmarkImageOutput", image);
  exportVariable("BookmarkImage", result.ogImage.url);
  return image;
}

// Credit: https://gist.github.com/mathewbyrne/1280286
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function titleParser(title: string) {
  const split = title.split(" ");
  const url = isUrl(split[0]) ? split[0] : undefined;
  const date = isDate(split[1])
    ? split[1]
    : new Date().toISOString().slice(0, 10);
  exportVariable("DateBookmarked", date);
  return {
    url,
    date,
  };
}

// make sure date is in YYYY-MM-DD format
const dateFormat = (date: string) => date.match(/^\d{4}-\d{2}-\d{2}$/) != null;
// make sure date value is a date
const isDate = (date: string) => !isNaN(Date.parse(date)) && dateFormat(date);
const isUrl = (url: string) => url.startsWith("http");
