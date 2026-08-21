import { describe, expect, it } from "vitest";
import { activeChannelSearchFilterCount } from "../filterState";

describe("channel search filter state", () => {
  it("counts each selected sender as an individual active filter", () => {
    expect(
      activeChannelSearchFilterCount({
        senderUids: ["u1", "u2", "u3"],
        sort: "time_desc",
      })
    ).toBe(3);
  });

  it("counts sender, sort, and date filters together", () => {
    expect(
      activeChannelSearchFilterCount({
        senderUids: ["u1", "u2"],
        sort: "time_asc",
        startAt: 1767225600,
        endAt: 1767830399,
      })
    ).toBe(4);
  });
});
