import { exportVariable, getInput, warning } from "@actions/core";
import ogs from "open-graph-scraper";
import { Bookmark } from "./add-bookmark";
import { setImage } from "./set-image";
import { checkWaybackStatus } from "./wayback";

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
  try {
    const { result } = await ogs({ url, downloadLimit: false });
    exportVariable("BookmarkTitle", result.ogTitle);
    exportVariable("DateBookmarked", date);
    const image = getInput("export-image") === "true" ? setImage(result) : "";
    const waybackResponse = await checkWaybackStatus(url);
    const waybackUrl = waybackResponse?.archived_snapshots?.closest?.url;
    if (!waybackUrl) {
      warning(`No wayback url found for ${url}`);
    }
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
      ...(waybackUrl && {
        waybackUrl,
      }),
    };
  } catch (error) {
    throw new Error(`Error getting metadata for ${url}: ${error.result.error}`);
  }
}

function toArray(tags: string): string[] {
  return tags.split(",").map((f) => f.trim());
}
