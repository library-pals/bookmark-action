import { getInput } from "@actions/core";
import { toArray } from "./get-metadata";

export function setAdditionalProperties(payload) {
  const additionalPropertiesList = toArray(getInput("additional-properties"));

  if (!additionalPropertiesList.length) return undefined;

  return additionalPropertiesList.reduce((acc, property: string) => {
    acc[property] = payload[property];
    return acc;
  }, {});
}
