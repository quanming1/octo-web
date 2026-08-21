import { beforeEach, describe, expect, it, vi } from "vitest";

const { openSummaryDetailMock, wkAppMock } = vi.hoisted(() => {
  const openSummaryDetailMock = vi.fn();
  return {
    openSummaryDetailMock,
    wkAppMock: {
      openSummaryDetail: openSummaryDetailMock as ((taskId: number | string, spaceId?: string) => void) | undefined,
    },
  };
});

vi.mock("../../../App", () => ({
  default: wkAppMock,
}));

import { openUrl } from "../renderer/actions";

describe("openUrl", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    openSummaryDetailMock.mockReset();
    wkAppMock.openSummaryDetail = openSummaryDetailMock;
    vi.spyOn(window, "open").mockImplementation(() => null);
  });

  it("routes /s/<taskNo> summary links internally", () => {
    openUrl("https://web.example.com/s/ST202607145kstyh08?sp=space-1");

    expect(openSummaryDetailMock).toHaveBeenCalledTimes(1);
    expect(openSummaryDetailMock).toHaveBeenCalledWith("ST202607145kstyh08", "space-1");
    expect(window.open).not.toHaveBeenCalled();
  });

  it("routes /s/<taskNo> without sp with undefined space", () => {
    openUrl("https://web.example.com/s/ST202607145kstyh08");

    expect(openSummaryDetailMock).toHaveBeenCalledTimes(1);
    expect(openSummaryDetailMock).toHaveBeenCalledWith("ST202607145kstyh08", undefined);
    expect(window.open).not.toHaveBeenCalled();
  });

  it("opens external https links in a new tab", () => {
    openUrl("https://web.example.com/docs/ST202607145kstyh08");

    expect(openSummaryDetailMock).not.toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith(
      "https://web.example.com/docs/ST202607145kstyh08",
      "_blank",
      "noopener,noreferrer"
    );
  });

  it("ignores unsafe urls", () => {
    openUrl("javascript:alert(1)");

    expect(openSummaryDetailMock).not.toHaveBeenCalled();
    expect(window.open).not.toHaveBeenCalled();
  });

  it("falls back to window.open when summary routing is unavailable", () => {
    wkAppMock.openSummaryDetail = undefined;

    openUrl("https://web.example.com/s/ST202607145kstyh08?sp=space-1");

    expect(openSummaryDetailMock).not.toHaveBeenCalled();
    expect(window.open).toHaveBeenCalledWith(
      "https://web.example.com/s/ST202607145kstyh08?sp=space-1",
      "_blank",
      "noopener,noreferrer"
    );
  });
});
