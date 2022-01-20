import { exportVariable } from "@actions/core";

// Credit: https://gist.github.com/mathewbyrne/1280286
export function slugify(text: string) {
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

/** Validate that string is in correct date format */
function dateFormat(date: string) {
  return date.match(/^\d{4}-\d{2}-\d{2}$/) != null;
}
/** Validate that string is a date */
function isDate(date: string) {
  return !isNaN(Date.parse(date)) && dateFormat(date);
}
/** Validate that string is a url */
function isUrl(url: string) {
  return url.startsWith("http");
}
