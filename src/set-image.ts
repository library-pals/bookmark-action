import { exportVariable, warning } from "@actions/core";
import { slugify } from "./utils.js";
import fetch from "node-fetch";

function handleMimeType(type: string) {
  const matches = type.match("(jpe?g)|(png)");
  // TO DO: Refactor
  return matches ? matches[0].replace("jpeg", "jpg") : "jpg";
}

export async function setImage(result) {
  if (!result.ogImage || !result.ogTitle) {
    warning("Unable to get a thumbnail image for this bookmark");
    return;
  }
  const image = Array.isArray(result.ogImage)
    ? result.ogImage[0]
    : result.ogImage;
  if (!image.url) {
    warning("Unable to get a thumbnail image for this bookmark");
    return;
  }
  const imageType = image.type ? `.${handleMimeType(image.type)}` : ".jpg";
  const imageName = `bookmark-${slugify(result.ogTitle)}${imageType}`;

  const isValid = await isImagePathValid(image.url);

  if (!isValid) {
    return;
  }

  exportVariable("BookmarkImageOutput", imageName);
  exportVariable("BookmarkImage", image.url);
  return imageName;
}

async function isImagePathValid(path: string): Promise<boolean> {
  try {
    const response = await fetch(path);
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    warning(`Unable to access image ${path}: ${error.message}`);
    return false;
  }
}
