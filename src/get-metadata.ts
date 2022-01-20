import { exportVariable } from "@actions/core";
import ogs from "open-graph-scraper";
import { OpenGraphObject } from "./utils";
import { setImage } from "./set-image";

export async function getMetadata({
  url,
  body,
  date,
}: {
  url: string;
  body?: string;
  date: string;
}) {
  const { result } = (await ogs({ url })) as { result: OpenGraphObject };
  exportVariable("BookmarkTitle", result.ogTitle);
  exportVariable("DateBookmarked", date);
  const image = setImage(result);
  return {
    title: result.ogTitle || "",
    site: result.ogSiteName || "",
    date,
    description: result.ogDescription || "",
    url: result.ogUrl,
    image: image || "",
    type: result.ogType || "",
    ...(body && { notes: body }),
  };
}
