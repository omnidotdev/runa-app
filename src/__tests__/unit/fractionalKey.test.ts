import { describe, expect, it } from "bun:test";

import { keyBetween, keysBetween, reorderKey } from "@/lib/util/fractionalKey";

describe("keyBetween", () => {
  it("returns the library default for two open boundaries", () => {
    expect(keyBetween(null, null)).toBe("a0");
  });

  it("returns a key strictly between two adjacent keys", () => {
    const between = keyBetween("a0", "a1");

    expect(between > "a0").toBe(true);
    expect(between < "a1").toBe(true);
  });

  it("appends after a single existing key", () => {
    const after = keyBetween("a0", null);

    expect(after > "a0").toBe(true);
  });

  it("prepends before a single existing key", () => {
    const before = keyBetween(null, "a0");

    expect(before < "a0").toBe(true);
  });
});

describe("keysBetween", () => {
  it("returns n strictly increasing keys for two open boundaries", () => {
    const keys = keysBetween(null, null, 5);

    expect(keys).toHaveLength(5);
    for (let i = 1; i < keys.length; i++) {
      expect(keys[i]! > keys[i - 1]!).toBe(true);
    }
  });

  it("returns n strictly increasing keys between bounded endpoints", () => {
    const keys = keysBetween("a0", "a5", 4);

    expect(keys).toHaveLength(4);
    expect(keys[0]! > "a0").toBe(true);
    expect(keys.at(-1)! < "a5").toBe(true);
    for (let i = 1; i < keys.length; i++) {
      expect(keys[i]! > keys[i - 1]!).toBe(true);
    }
  });

  it("returns an empty array when n is 0", () => {
    expect(keysBetween(null, null, 0)).toEqual([]);
  });
});

describe("reorderKey", () => {
  type Item = { id: string; key: string };

  const itemKey = (item: Item) => item.key;

  it("computes a key for prepending to the front", () => {
    const siblings: Item[] = [
      { id: "a", key: "a1" },
      { id: "b", key: "a2" },
    ];

    const newKey = reorderKey(siblings, 0, itemKey);

    expect(newKey < "a1").toBe(true);
  });

  it("computes a key for appending to the end", () => {
    const siblings: Item[] = [
      { id: "a", key: "a1" },
      { id: "b", key: "a2" },
    ];

    const newKey = reorderKey(siblings, siblings.length, itemKey);

    expect(newKey > "a2").toBe(true);
  });

  it("computes a key for inserting in the middle", () => {
    const siblings: Item[] = [
      { id: "a", key: "a1" },
      { id: "b", key: "a3" },
    ];

    const newKey = reorderKey(siblings, 1, itemKey);

    expect(newKey > "a1").toBe(true);
    expect(newKey < "a3").toBe(true);
  });

  it("places a key first when inserting into an empty list", () => {
    const newKey = reorderKey<Item>([], 0, itemKey);

    expect(newKey).toBe("a0");
  });

  it("supports a full drag round-trip from index 2 to index 0", () => {
    const original: Item[] = [
      { id: "a", key: "a0" },
      { id: "b", key: "a1" },
      { id: "moved", key: "a2" },
    ];
    const siblings = original.filter((item) => item.id !== "moved");

    const newKey = reorderKey(siblings, 0, itemKey);
    const updated = [...siblings, { id: "moved", key: newKey }].sort((a, b) =>
      a.key < b.key ? -1 : a.key > b.key ? 1 : 0,
    );

    expect(updated[0]!.id).toBe("moved");
  });
});
