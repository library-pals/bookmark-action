import { getInput, warning } from "@actions/core";
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

  it("warns and removes reserved properties from the additional properties list", () => {
    (getInput as jest.MockedFunction<typeof getInput>).mockReturnValueOnce(
      "url"
    );

    const payload = { url: "value1", prop2: "value2", title: "value3" };
    const result = setAdditionalProperties(payload);

    expect(warning).toHaveBeenCalledWith(
      'The additional property "url" is reserved and cannot be used'
    );

    expect(result).toBeUndefined();
  });

  it("throws an error when trying to set more than 5 additional properties", () => {
    (getInput as jest.MockedFunction<typeof getInput>).mockReturnValueOnce(
      "prop1,prop2,prop3,prop4,prop5,prop6"
    );

    const payload = {
      prop1: "value1",
      prop2: "value2",
      prop3: "value3",
      prop4: "value4",
      prop5: "value5",
      prop6: "value6",
    };

    expect(() => setAdditionalProperties(payload)).toThrow(
      "You can only set 5 additional properties. You tried to set 6: prop1, prop2, prop3, prop4, prop5, prop6"
    );
  });
});
