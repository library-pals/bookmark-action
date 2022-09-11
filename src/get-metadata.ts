import { exportVariable, setFailed } from "@actions/core";
import ogs from "open-graph-scraper";
import { setImage } from "./set-image";

export async function getMetadata({
  url,
  notes,
  date,
}: {
  url: string;
  notes?: string;
  date: string;
}) {
  const { result, error } = await ogs({ url });
  if (error) {
    setFailed(`${result}`);
    return;
  }
  exportVariable("BookmarkTitle", result.ogTitle);
  exportVariable("DateBookmarked", date);
  const image = setImage(result);
  return {
    title: result.ogTitle || "",
    site: result.ogSiteName || "",
    date,
    description: result.ogDescription || "",
    url: result.ogUrl || result.requestUrl,
    image: image || "",
    type: result.ogType || "",
    ...(notes && { notes }),
  };
}
