import { exportVariable } from "@actions/core";

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

// make sure date is in YYYY-MM-DD format
const dateFormat = (date: string) => date.match(/^\d{4}-\d{2}-\d{2}$/) != null;
// make sure date value is a date
const isDate = (date: string) => !isNaN(Date.parse(date)) && dateFormat(date);
const isUrl = (url: string) => url.startsWith("http");
