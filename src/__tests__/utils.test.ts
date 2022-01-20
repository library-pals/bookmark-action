import { titleParser } from "../utils";

jest.mock("@actions/core");

describe("titleParser", () => {
  test("no date", () => {
    expect(
      titleParser(
        "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d"
      )
    ).toEqual({
      date: new Date().toISOString().slice(0, 10),
      url: "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
    });
  });
  test("with date", () => {
    expect(
      titleParser(
        "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d 2022-01-01"
      )
    ).toEqual({
      date: "2022-01-01",
      url: "https://www.hulu.com/series/pen15-8c87035d-2b10-4b10-a233-ca5b3597145d",
    });
  });
});
