import { getInput, warning } from "@actions/core";
import { toArray } from "./get-metadata.js";
import { Bookmark } from "./add-bookmark.js";

type BookmarkKeys = keyof Bookmark;
type Payload = { [key: string]: string };

const MAX_ADDITIONAL_PROPERTIES = 5;

const reservedKeys: BookmarkKeys[] = [
  "title",
  "site",
  "date",
  "description",
  "url",
  "author",
  "type",
  "image",
  "notes",
  "tags",
];

export function setAdditionalProperties(payload: Payload): Payload | undefined {
  let additionalPropertiesList = toArray(getInput("additional-properties"));

  if (!additionalPropertiesList.length) return undefined;

  additionalPropertiesList = additionalPropertiesList.filter((property) => {
    if (reservedKeys.includes(property as BookmarkKeys)) {
      warning(
        `The additional property "${property}" is reserved and cannot be used`
      );
      return false;
    }
    return true;
  });

  if (!additionalPropertiesList.length) return undefined;

  if (additionalPropertiesList.length > MAX_ADDITIONAL_PROPERTIES) {
    throw new Error(
      `You can only set ${MAX_ADDITIONAL_PROPERTIES} additional properties. You tried to set ${
        additionalPropertiesList.length
      }: ${additionalPropertiesList.join(", ")}`
    );
  }

  return additionalPropertiesList.reduce((acc: Payload, property: string) => {
    acc[property] = payload[property];
    return acc;
  }, {});
}
