const core = require("@actions/core");

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

module.exports = {
  setImage,
};
