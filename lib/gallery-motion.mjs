const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function mapPointerToStage({ x, y, width, height }) {
  const nx = clamp((x / width - 0.5) * 2, -1, 1);
  const ny = clamp((y / height - 0.5) * 2, -1, 1);

  return {
    rotateX: Number((-ny * 3).toFixed(3)),
    rotateY: Number((nx * 5).toFixed(3)),
    x: Number((nx * 18).toFixed(3)),
    y: Number((ny * 10).toFixed(3)),
  };
}

const DEPTHS = [8, -18, 22, -8, 14, -24];

export function getCardPose(index, total) {
  const column = index % 3;
  const row = Math.floor(index / 3);

  return {
    x: (column - 1) * 18,
    y: row * 12,
    z: DEPTHS[index % DEPTHS.length],
    rotateX: row % 2 ? -1.2 : 1.2,
    rotateY: (column - 1) * -2.4,
    rotateZ: ((index * 7) % 5) - 2,
  };
}
