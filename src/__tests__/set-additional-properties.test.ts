import { getInput } from "@actions/core";
import { setAdditionalProperties } from "../set-additional-properties";

jest.mock("@actions/core");

describe("setAdditionalProperties", () => {
  it("returns undefined when additionalPropertiesList is undefined", () => {
    const result = setAdditionalProperties({
      prop1: "value1",
      prop2: "value2",
    });

    expect(result).toBeUndefined();
  });

  it("returns undefined when additionalPropertiesList is empty", () => {
    (getInput as jest.MockedFunction<typeof getInput>).mockReturnValueOnce("");

    const result = setAdditionalProperties({
      prop1: "value1",
      prop2: "value2",
    });

    expect(result).toBeUndefined();
  });

  it("returns additionalPropertiesList", () => {
    (getInput as jest.MockedFunction<typeof getInput>).mockReturnValueOnce(
      "prop1,prop2"
    );

    const result = setAdditionalProperties({
      prop1: "value1",
      prop2: "value2",
    });

    expect(result).toMatchInlineSnapshot(`
{
  "prop1": "value1",
  "prop2": "value2",
}
`);
  });
});
