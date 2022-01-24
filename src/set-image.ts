import { exportVariable } from "@actions/core";
import { slugify } from "./utils";

function handleMimeType(type: string) {
  const matches = type.match("(jpe?g)|(png)");
  // TO DO: Refactor
  return matches ? matches[0].replace("jpeg", "jpg") : "jpg";
}

export function setImage(result) {
  if (!result.ogImage || !result.ogImage.url || !result.ogTitle) return;
  const imageType = result.ogImage.type
    ? `.${handleMimeType(result.ogImage.type)}`
    : ".jpg";
  const image = `bookmark-${slugify(result.ogTitle)}${imageType}`;
  exportVariable("BookmarkImageOutput", image);
  exportVariable("BookmarkImage", result.ogImage.url);
  return image;
}
