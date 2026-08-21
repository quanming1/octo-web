import { describe, expect, it } from "vitest";
import { getSemiDirection, getSemiLocale } from "../semiLocale";

describe("semiLocale", () => {
  it("maps app locales to Semi locale packages", () => {
    expect(getSemiLocale("zh-CN").code).toBe("zh-CN");
    expect(getSemiLocale("zh-CN").DatePicker.placeholder.date).toBe("请选择日期");
    expect(getSemiLocale("en-US").code).toBe("en-US");
    expect(getSemiLocale("en-US").DatePicker.placeholder.date).toBe("Select date");
  });

  it("uses the shared text direction mapping", () => {
    expect(getSemiDirection("zh-CN")).toBe("ltr");
    expect(getSemiDirection("en-US")).toBe("ltr");
  });
});
