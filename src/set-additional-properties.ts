import { getInput, warning } from "@actions/core";
import { toArray } from "./get-metadata";
import { Bookmark } from "./add-bookmark";

type BookmarkKeys = keyof Bookmark;

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

export function setAdditionalProperties(payload: {
  [key: string]: string;
}): { [key: string]: string } | undefined {
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

  return additionalPropertiesList.reduce((acc, property: string) => {
    acc[property] = payload[property];
    return acc;
  }, {});
}
