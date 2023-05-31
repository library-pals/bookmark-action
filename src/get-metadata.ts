import { exportVariable, getInput, setFailed } from "@actions/core";
import ogs from "open-graph-scraper";
import { Bookmark } from "./add-bookmark";
import { setImage } from "./set-image";

export async function getMetadata({
  url,
  notes,
  date,
  tags,
}: {
  url: string;
  notes?: string;
  date: string;
  tags?: string;
}): Promise<Bookmark | undefined> {
  const { result, error } = await ogs({ url });
  if (error) {
    setFailed(`${result.error}`);
    return;
  }
  exportVariable("BookmarkTitle", result.ogTitle);
  exportVariable("DateBookmarked", date);
  const image = getInput("export-image") === "true" ? setImage(result) : "";
  return {
    title: result.ogTitle || "",
    site: result.ogSiteName || "",
    author: result.author || "",
    date,
    description: result.ogDescription || "",
    url: result.ogUrl || result.requestUrl,
    image,
    type: result.ogType || "",
    ...(notes && { notes }),
    ...(tags && { tags: toArray(tags) }),
  };
}

function toArray(tags: string): string[] {
  return tags.split(",").map((f) => f.trim());
}
