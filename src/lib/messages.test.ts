import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

/**
 * Guards against locale drift and against the encoding damage that a
 * PowerShell read/write round-trip inflicted on these files once already —
 * reading UTF-8 as ANSI and writing it back turned every em dash into "â€"".
 */

const files = ["messages/nl.json", "messages/en.json"] as const;

function flatKeys(obj: unknown, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    return [prefix];
  }
  return Object.entries(obj).flatMap(([k, v]) =>
    flatKeys(v, prefix ? `${prefix}.${k}` : k),
  );
}

test("both locale files are valid UTF-8 JSON with no BOM", () => {
  for (const f of files) {
    const buf = fs.readFileSync(f);
    assert.ok(
      !(buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf),
      `${f} must not have a BOM`,
    );
    assert.doesNotThrow(() => JSON.parse(buf.toString("utf8")), `${f} parses`);
  }
});

test("no mojibake from a bad encoding round-trip", () => {
  for (const f of files) {
    const txt = fs.readFileSync(f, "utf8");
    const bad = txt.match(/â€|Â·|Ã—|Ã©|Ã¨|Ã¯/g);
    assert.equal(bad, null, `${f} contains mojibake: ${bad?.join(", ")}`);
  }
});

test("locales have identical key sets", () => {
  const [nl, en] = files.map(
    (f) => JSON.parse(fs.readFileSync(f, "utf8")) as unknown,
  );
  const kn = flatKeys(nl).sort();
  const ke = flatKeys(en).sort();

  const onlyNl = kn.filter((k) => !ke.includes(k));
  const onlyEn = ke.filter((k) => !kn.includes(k));

  assert.deepEqual(onlyNl, [], "keys present only in nl");
  assert.deepEqual(onlyEn, [], "keys present only in en");
});

test("no message is left empty", () => {
  for (const f of files) {
    const data = JSON.parse(fs.readFileSync(f, "utf8")) as unknown;
    const walk = (node: unknown, path: string) => {
      if (typeof node === "string") {
        assert.notEqual(node.trim(), "", `${f}: ${path} is empty`);
        return;
      }
      if (node && typeof node === "object") {
        for (const [k, v] of Object.entries(node)) {
          walk(v, path ? `${path}.${k}` : k);
        }
      }
    };
    walk(data, "");
  }
});
