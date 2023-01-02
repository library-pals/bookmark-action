import { exportVariable, getInput, setFailed } from "@actions/core";
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
  exportVariable("BookmarkTitle", result.ogTitle?.replace(/"/g, "'"));
  exportVariable("DateBookmarked", date);
  const image = getInput("getImage") === "true" ? setImage(result) : "";
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
  };
}
