import test from "node:test";
import assert from "node:assert/strict";
import { getCardPose, mapPointerToStage } from "../lib/gallery-motion.mjs";

test("pointer mapping is centered and bounded", () => {
  assert.deepEqual(
    mapPointerToStage({ x: 500, y: 300, width: 1000, height: 600 }),
    { rotateX: 0, rotateY: 0, x: 0, y: 0 }
  );
  const edge = mapPointerToStage({ x: 1000, y: 0, width: 1000, height: 600 });
  assert.ok(Math.abs(edge.rotateX) <= 3);
  assert.ok(Math.abs(edge.rotateY) <= 5);
  assert.ok(Math.abs(edge.x) <= 18);
  assert.ok(Math.abs(edge.y) <= 10);
});

test("card poses create deterministic depth", () => {
  assert.deepEqual(getCardPose(0, 6), getCardPose(0, 6));
  assert.notEqual(getCardPose(0, 6).z, getCardPose(1, 6).z);
});
