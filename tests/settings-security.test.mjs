import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("settings PATCH authenticates before using the privileged client", async () => {
  const source = await readFile(
    new URL("../app/api/settings/route.js", import.meta.url),
    "utf8"
  );
  const authGuard = source.indexOf("if (!isAdminRequest(request))");
  const privilegedWrite = source.indexOf('.from("settings")');

  assert.ok(authGuard >= 0, "settings PATCH must reject unauthenticated callers");
  assert.ok(
    privilegedWrite > authGuard,
    "authentication must run before the service-role database write"
  );
});
