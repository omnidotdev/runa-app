import { describe, expect, it, mock } from "bun:test";

import { submitOnEnter, submitOnModEnter } from "@/lib/util/submitOnEnter";

import type { KeyboardEvent } from "react";

const key = (
  k: string,
  opts: Partial<{
    shiftKey: boolean;
    metaKey: boolean;
    ctrlKey: boolean;
    isComposing: boolean;
  }> = {},
) =>
  ({
    key: k,
    shiftKey: opts.shiftKey ?? false,
    metaKey: opts.metaKey ?? false,
    ctrlKey: opts.ctrlKey ?? false,
    nativeEvent: { isComposing: opts.isComposing ?? false },
    preventDefault: mock(() => {}),
  }) as unknown as KeyboardEvent;

describe("submitOnEnter", () => {
  it("submits on a plain Enter", () => {
    const submit = mock(() => {});
    const event = key("Enter");
    submitOnEnter(submit)(event);
    expect(submit).toHaveBeenCalledTimes(1);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it("ignores Shift+Enter, modified Enter, IME Enter, and other keys", () => {
    const submit = mock(() => {});
    const handler = submitOnEnter(submit);
    handler(key("Enter", { shiftKey: true }));
    handler(key("Enter", { metaKey: true }));
    handler(key("Enter", { ctrlKey: true }));
    handler(key("Enter", { isComposing: true }));
    handler(key("a"));
    expect(submit).not.toHaveBeenCalled();
  });
});

describe("submitOnModEnter", () => {
  it("submits on Cmd/Ctrl+Enter", () => {
    const submit = mock(() => {});
    submitOnModEnter(submit)(key("Enter", { metaKey: true }));
    submitOnModEnter(submit)(key("Enter", { ctrlKey: true }));
    expect(submit).toHaveBeenCalledTimes(2);
  });

  it("ignores plain Enter and IME composition", () => {
    const submit = mock(() => {});
    submitOnModEnter(submit)(key("Enter"));
    submitOnModEnter(submit)(
      key("Enter", { metaKey: true, isComposing: true }),
    );
    expect(submit).not.toHaveBeenCalled();
  });
});
