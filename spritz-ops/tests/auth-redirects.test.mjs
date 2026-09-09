/**
 * The allowlist merge must never drop an entry somebody added by hand, and
 * running it twice must be a no-op. Both are easy to get wrong and expensive
 * to discover in production, so they get a stub API rather than a live token.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const SCRIPT = new URL("../scripts/auth-redirects.mjs", import.meta.url).pathname;

/** Stands in for the Supabase Management API, remembering what was PATCHed. */
function stubApi(initial) {
  let allow = initial;
  const patches = [];
  const server = createServer((req, res) => {
    if (req.method === "PATCH") {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", () => {
        const sent = JSON.parse(body);
        patches.push(sent);
        allow = sent.uri_allow_list;
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify({ uri_allow_list: allow }));
      });
      return;
    }
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ site_url: "https://stub", uri_allow_list: allow }));
  });
  return { server, patches, current: () => allow };
}

async function withStub(initial, args) {
  const api = stubApi(initial);
  await new Promise((r) => api.server.listen(0, r));
  const port = api.server.address().port;
  try {
    const { stdout } = await run("node", [SCRIPT, ...args], {
      env: {
        ...process.env,
        SUPABASE_ACCESS_TOKEN: "stub-token",
        SUPABASE_API: `http://127.0.0.1:${port}`,
      },
    });
    return { stdout, ...api };
  } finally {
    api.server.close();
  }
}

test("--ensure adds what is missing and keeps what was already there", async () => {
  const handAdded = "https://added-by-hand.example/**";
  const { patches, current } = await withStub(
    `https://spritz-ops.vercel.app/**,${handAdded}`,
    ["--ensure"],
  );

  assert.equal(patches.length, 1, "should patch exactly once");
  const after = current().split(",");
  assert.ok(after.includes(handAdded), "must not drop a hand-added entry");
  assert.ok(after.includes("http://localhost:4100/**"), "must add localhost");
  assert.ok(
    after.some((u) => u.includes("spritz-*-deteandrei97business")),
    "must add the preview wildcard",
  );
});

test("running it again changes nothing", async () => {
  const settled = [
    "https://spritz-ops.vercel.app/**",
    "https://spritz-*-deteandrei97business-3434s-projects.vercel.app/**",
    "http://localhost:4100/**",
  ].join(",");
  const { patches, stdout } = await withStub(settled, ["--ensure"]);
  assert.equal(patches.length, 0, "a second run must not write");
  assert.match(stdout, /nothing to do/);
});

test("no duplicates when one of several is already present", async () => {
  const { current } = await withStub("http://localhost:4100/**", ["--ensure"]);
  const after = current().split(",");
  const dupes = after.filter((u) => u === "http://localhost:4100/**");
  assert.equal(dupes.length, 1, "existing entry must not be doubled");
});
