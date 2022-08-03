import { exportVariable } from "@actions/core";
import { slugify } from "./utils";

function handleMimeType(type: string) {
  const matches = type.match("(jpe?g)|(png)");
  // TO DO: Refactor
  return matches ? matches[0].replace("jpeg", "jpg") : "jpg";
}

export function setImage(result) {
  if (!result.ogImage || !result.ogTitle) return;
  const image = Array.isArray(result.ogImage)
    ? result.ogImage[0]
    : result.ogImage;
  if (!image.url) return;
  const imageType = image.type ? `.${handleMimeType(image.type)}` : ".jpg";
  const imageName = `bookmark-${slugify(result.ogTitle)}${imageType}`;
  exportVariable("BookmarkImageOutput", imageName);
  exportVariable("BookmarkImage", image.url);
  return imageName;
}
