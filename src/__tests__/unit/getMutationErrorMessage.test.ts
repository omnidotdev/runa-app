import { describe, expect, it } from "bun:test";

import { ClientError } from "graphql-request";

import { getMutationErrorMessage } from "@/lib/graphql/getMutationErrorMessage";

const FALLBACK = "Failed to create task. Please try again.";

/** Build a ClientError whose response carries the given error extension codes. */
const clientError = (codes: (string | undefined)[]) =>
  new ClientError(
    {
      status: 200,
      errors: codes.map((code) => ({
        message: "rejected",
        extensions: code ? { code } : {},
      })),
      // biome-ignore lint/suspicious/noExplicitAny: minimal response for the test
    } as any,
    // biome-ignore lint/suspicious/noExplicitAny: request context is unused
    {} as any,
  );

describe("getMutationErrorMessage", () => {
  it("returns the moderation message for a CONTENT_MODERATED error", () => {
    const message = getMutationErrorMessage(
      clientError(["CONTENT_MODERATED"]),
      FALLBACK,
    );
    expect(message).toBe(
      "Your text was flagged as inappropriate language. Please edit it and try again.",
    );
  });

  it("detects CONTENT_MODERATED among multiple errors", () => {
    const message = getMutationErrorMessage(
      clientError(["SOMETHING_ELSE", "CONTENT_MODERATED"]),
      FALLBACK,
    );
    expect(message).toContain("inappropriate language");
  });

  it("returns the fallback for a different error code", () => {
    expect(
      getMutationErrorMessage(clientError(["UNAUTHENTICATED"]), FALLBACK),
    ).toBe(FALLBACK);
  });

  it("returns the fallback when there are no error extensions", () => {
    expect(getMutationErrorMessage(clientError([undefined]), FALLBACK)).toBe(
      FALLBACK,
    );
  });

  it("returns the fallback for a non-ClientError", () => {
    expect(getMutationErrorMessage(new Error("network down"), FALLBACK)).toBe(
      FALLBACK,
    );
    expect(getMutationErrorMessage(undefined, FALLBACK)).toBe(FALLBACK);
  });
});
