/**
 * Jigsaw puzzle: twelve interlocking pieces on a board, each a thin plate with
 * knobs and sockets on its inner edges. The pointer loosens the puzzle: the
 * pieces near it turn out of the grid and rise a little, the turn falling
 * off with distance, and the piece nearest it is bright. At rest the puzzle
 * is assembled but for one piece left turned and lifted, bright. The slider
 * is how far the pieces turn.
 *
 * The pattern: a continuous falloff on a spring per piece (angle and lift);
 * the hit is the board's top plane, which never moves.
 */
const {
  Cam, fit, prism, proj, rings, facing, unproj, spring, stepS, poly, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NX = 4, NY = 3, S = 24, H = S / 2, Z0 = 5, TH = 2.4, FAV = 6, TURN = 0.62;
const sgn = (a, b) => (((a * 7 + b * 13) % 3) === 0 ? -1 : 1);

function outline(i, j) {
  const e = [j > 0 ? -sgn(i, j) : 0, i < NX - 1 ? sgn(i + 1, j + 9) : 0, j < NY - 1 ? sgn(i, j + 1) : 0, i > 0 ? -sgn(i, j + 9) : 0];
  const C4 = [[-H, -H], [H, -H], [H, H], [-H, H]], N4 = [[0, -1], [1, 0], [0, 1], [-1, 0]], pts = [];
  for (let k = 0; k < 4; k++) {
    const a = C4[k], b = C4[(k + 1) % 4], n = N4[k];
    for (let s = 0; s < 16; s++) {
      const t = s / 16, w = t > 0.3 && t < 0.7 ? Math.sqrt(Math.sin(Math.PI * (t - 0.3) / 0.4)) * 5.5 * e[k] : 0;
      const bulge = t > 0.3 && t < 0.7 ? Math.sin(Math.PI * (t - 0.3) / 0.4) * 0.12 * e[k] : 0;
      const tt = t + (t - 0.5) * -bulge;
      pts.push([a[0] + (b[0] - a[0]) * tt + n[0] * w, a[1] + (b[1] - a[1]) * tt + n[1] * w]);
    }
  }
  return pts;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.55);
  const BX = (NX * S) / 2 + 6, BY = (NY * S) / 2 + 6;
  fit(C, [[-BX, -BY, 0], [BX, BY, 0], [-BX, -BY, Z0 + 10], [BX, BY, Z0 + 10]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(-BX, -BY, BX, BY, 7, 1.8), 0, Z0));
  const pieces = [];
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
    const k = j * NX + i, cx = -BX + 6 + (i + 0.5) * S, cy = -BY + 6 + (j + 0.5) * S;
    const ra = k === FAV ? 0.38 : ((k * 37) % 7 - 3) * 0.012, rz = k === FAV ? 4 : 0;
    pieces.push({ k, i, j, cx, cy, ra, rz, out: outline(i, j), a: spring(ra), z: spring(rz), drawn: "" });
  }
  pieces.sort((p, q) => p.cx + p.cy - (q.cx + q.cy));
  for (const p of pieces) { p.g = mk("g", {}, g); p.lo = mk("path", { class: "sil", d: "" }, p.g); p.hi = mk("path", { class: "sil", d: "" }, p.g); }

  function draw(p) {
    const a = p.a.x, z = p.z.x, key = a.toFixed(4) + z.toFixed(3);
    if (key === p.drawn) return;
    p.drawn = key;
    const c = Math.cos(a), s = Math.sin(a), at = (h) => p.out.map(([u, v]) => P(p.cx + u * c - v * s, p.cy + u * s + v * c, h));
    p.lo.setAttribute("d", poly(at(Z0 + z)));
    p.hi.setAttribute("d", poly(at(Z0 + z + TH)));
  }
  const B = register(stage, (dt) => { let m = false; for (const p of pieces) { if (stepS(p.a, dt)) m = true; if (stepS(p.z, dt)) m = true; draw(p); } return m; });
  bag.add(B.unregister);

  function go(w) {
    let near = null, bd = Infinity;
    for (const p of pieces) {
      if (!w) { p.a.t = p.ra; p.z.t = p.rz; continue; }
      const d = Math.hypot(w[0] - p.cx, w[1] - p.cy), f = d < S * 0.5 ? 1 : clamp(Math.exp(-((d - S * 0.5) ** 2) / (2 * 22 * 22)), 0.08, 1);
      if (d < bd) { bd = d; near = p; }
      p.a.t = p.ra * 0.3 + f * TURN * value * ((p.i + p.j) % 2 ? 1 : -1);
      p.z.t = f * 6;
    }
    for (const p of pieces) p.hi.classList.toggle("hi", w ? p === near : p.k === FAV);
    read.textContent = near ? "piece " + (near.i + 1) + "·" + (near.j + 1) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (q) => {
      const [x, y] = unproj(C, q[0], q[1], Z0);
      go(Math.abs(x) < BX + 14 && Math.abs(y) < BY + 14 ? [clamp(x, -BX, BX), clamp(y, -BY, BY)] : null);
    },
    leave: () => go(null),
  }));
  bag.add(() => svg.replaceChildren());
  go(null);
  return { set: (v) => { value = v; }, destroy: bag.dispose };
}

hairline({
  name: "jigsaw",
  means: "A jigsaw puzzle on its board: pieces near the pointer turn out of the grid and rise, and the nearest piece is bright.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.4],
  tour: [[178, 110], [178, 161], [222, 233], null],
  mount,
});
