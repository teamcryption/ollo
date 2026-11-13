/**
 * Abacus: a wooden frame on two feet with six rods across it, eight beads on
 * each rod. At rest every rod holds a number, its beads split between the two
 * ends. The pointer picks a rod by height and draws the beads toward its x,
 * each bead on its own spring: the rod under it gathers fully, the rods beside
 * it follow less. The slider is the reach, in rods.
 *
 * The pattern: a continuous field (terrain), on a single row of rods.
 */
const {
  Cam, clamp, fit, facing, hull, open, poly, prism, proj, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NR = 6, NB = 8, L = 112, ZR0 = 17, SP = 15, H = ZR0 + (NR - 1) * SP + 14, R = 4.7, BL = 6.6, BW = 7, FAV = 3;
const RIGHT = [2, 5, 1, 6, 3, 4]; // beads pushed right on each rod, bottom up: the number at rest
const falloff = (u) => (u <= 0 ? 1 : u <= 0.42 ? 1 - (u / 0.42) * 0.62 : u <= 1 ? 0.38 - ((u - 0.42) / 0.58) * 0.26 : 0.12);
const restX = (r, i) => (i < NB - RIGHT[r] ? 1 + BW / 2 + i * BW : L - 1 - BW / 2 - (NB - 1 - i) * BW);
const PROFILE = [[-0.5, 0.5], [-0.36, 0.86], [0, 1], [0.36, 0.86], [0.5, 0.5]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, over = null;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-7, -15, 0], [L + 7, 15, 0], [L + 7, -15, 0], [-7, 15, 0], [-7, -6, H], [L + 7, 6, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const o = P(0, 0, 0), ex = P(1, 0, 0), ez = P(0, 0, 1);
  const ax = [ex[0] - o[0], ex[1] - o[1]], az = [ez[0] - o[0], ez[1] - o[1]], det = ax[0] * az[1] - az[0] * ax[1];
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1) => { const s = solid(g); const [a, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, a, i, z0, z1)); return s; };

  // the far foot and post, the bottom rail; the rods and beads; then the top rail and the near post and foot
  block(-8, -15, 1, 15, 3, 1.4, 0, 4);
  block(-7, -6, 0, 6, 1.6, 1, 4, H);
  block(0, -5, L, 5, 1.4, 1, 4, 10);
  // a bead is round in y and z, swollen in the middle: its outline, relative to its centre, is the hull of five rings
  const ringYZ = (x, r, z) => Array.from({ length: 20 }, (_, n) => { const a = (n / 20) * Math.PI * 2; return [x, r * Math.cos(a), z + r * Math.sin(a)]; });
  const rods = [];
  for (let r = 0; r < NR; r++) {
    const z = ZR0 + r * SP, rg = mk("g", {}, g), rod = mk("path", { class: "sil" }, rg);
    rod.setAttribute("d", poly(hull(ringYZ(0, 1.1, z).concat(ringYZ(L, 1.1, z)).map((p) => P(...p)))));
    const c0 = P(0, 0, z);
    const shape = hull(PROFILE.flatMap(([u, k]) => ringYZ(u * BL, k * R, z).map((p) => P(...p)))).map((q) => [q[0] - c0[0], q[1] - c0[1]]);
    const belt = ringYZ(0, R, z).filter((p) => 0.61 * p[1] + 0.5 * (p[2] - z) > 0.4).map((p) => { const q = P(...p); return [q[0] - c0[0], q[1] - c0[1]]; });
    belt.sort((p, q) => p[1] - q[1]);
    const beads = [];
    for (let i = 0; i < NB; i++) {
      const el = mk("g", {}, rg), sil = mk("path", { class: "sil" }, el), cr = mk("path", { class: "nf lo" }, el);
      beads.push({ i, sil, cr, rest: restX(r, i), sp: spring(restX(r, i), { eps: 0.02 }), drawn: NaN });
    }
    rods.push({ r, z, c0, rod, shape, belt, beads });
  }
  block(0, -6, L, 6, 1.4, 1, H - 6, H);
  block(L, -6, L + 7, 6, 1.6, 1, 4, H);
  block(L - 1, -15, L + 8, 15, 3, 1.4, 0, 4);

  function draw(rd, b) {
    const x = b.sp.x;
    if (x === b.drawn) return;
    b.drawn = x;
    const dx = rd.c0[0] + ax[0] * x, dy = rd.c0[1] + ax[1] * x, at = (q) => [q[0] + dx, q[1] + dy];
    b.sil.setAttribute("d", poly(rd.shape.map(at)));
    b.cr.setAttribute("d", open(rd.belt.map(at)));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const rd of rods) for (const b of rd.beads) { if (stepS(b.sp, dt)) m = true; draw(rd, b); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    const lit = over ? over[1] : FAV;
    for (const rd of rods) {
      const w = over ? falloff(Math.abs(rd.r - over[1]) / reach) : 0;
      const c = clamp((over ? over[0] : 0) - ((NB - 1) / 2) * BW, 1 + BW / 2, L - 1 - BW / 2 - (NB - 1) * BW);
      for (const b of rd.beads) b.sp.t = b.rest + (c + b.i * BW - b.rest) * w;
      const on = rd.r === lit;
      rd.rod.classList.toggle("hi", on);
      for (const b of rd.beads) b.sil.classList.toggle("hi", on);
    }
    read.textContent = over ? "rod " + (NR - over[1]) : "rest";
    B.wake();
  }

  // the hit test: the pointer on the frame's own plane, which never moves; the rod is the nearest by height
  function hit([sx, sy]) {
    const u = sx - o[0], v = sy - o[1], x = (u * az[1] - az[0] * v) / det, z = (ax[0] * v - u * ax[1]) / det;
    const r = Math.round((z - ZR0) / SP);
    if (x < -4 || x > L + 4 || r < 0 || r >= NR || Math.abs(z - ZR0 - r * SP) > SP / 2) return null;
    return [clamp(x, 0, L), r];
  }
  const same = (a, b) => (a === b) || (a && b && a[0] === b[0] && a[1] === b[1]);
  bag.add(pointer(stage, {
    move: (p) => { const h = hit(p); if (!same(h, over)) { over = h; retarget(); } },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();

  return { set: (v) => { reach = v; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "abacus",
  means: "An abacus of six rods: the beads slide along their rods toward the pointer, the rod under it most.",
  rules: [1, 3, 5, 8],
  range: [1.5, 3, 6],
  tour: [[164, 180], [247, 146], [206, 176], null],
  mount,
});
