import { exportVariable } from "@actions/core";
import { slugify } from "./utils";

export function setImage(result) {
  if (!result.ogImage || !result.ogImage.url || !result.ogTitle) return;
  const imageType = result.ogImage.type ? `.${result.ogImage.type}` : ".jpg";
  const image = `bookmark-${slugify(result.ogTitle)}${imageType}`;
  exportVariable("BookmarkImageOutput", image);
  exportVariable("BookmarkImage", result.ogImage.url);
  return image;
}
