/**
 * Toy blocks: twelve wooden cubes scattered in a loose four-by-three grid on
 * a play mat, a few with raised dots on their tops. The pointer plays: the
 * blocks near it hop up and turn a little, each on its own springs, the one
 * under it highest and bright. At rest the blocks sit askew, one bright. The
 * slider is the reach, in block spacings.
 *
 * The pattern: a continuous field (terrain) over a grid; the hit is on the
 * plane of the blocks' resting tops, which never moves. A lifted block
 * leaves a dashed footprint on the mat where it rests.
 */
const {
  Cam, circ, clamp, facing, fit, poly, prism, proj, ringAt, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NI = 4, NJ = 3, SP = 27, HB = 8, BH = 16, HOP = 24, FAV = 6;
const JIT = [[0, 1, -8], [2, -1, 14], [-1, 2, 4], [1, 0, -16], [-2, 1, 10], [1, -2, -4], [0, 1, 18], [2, 2, -12], [1, -1, 6], [-1, 0, -20], [2, 1, 12], [0, -2, -6]];
const DOTS = { 1: 1, 4: 2, 6: 1, 11: 1 };
const MX = NI * SP + 4, MY = NJ * SP + 4;
const falloff = (u) => (u <= 0 ? 1 : u <= 0.45 ? 1 - (u / 0.45) * 0.62 : u <= 1 ? 0.38 - ((u - 0.45) / 0.55) * 0.38 : 0);
const turn = (ring, a, cx, cy) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value * SP, over = null;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-4, -4, -3], [MX, MY, -3], [MX, -4, -3], [-4, MY, -3], [8, 8, BH + HOP + 4], [MX - 8, 8, BH + HOP + 4]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [mo, mi] = rings(-4, -4, MX, MY, 6, 2.2);
  put(solid(g), prism(P, front, mo, mi, -3, 0));

  const [CUBE, CIN] = rings(-HB, -HB, HB, HB, 2.6, 1.2);
  const DISC = circ(2.6, 20), DIN = circ(1.6, 20);
  const blocks = [];
  for (let j = 0; j < NJ; j++) for (let i = 0; i < NI; i++) {
    const n = j * NI + i, [jx, jy, yaw] = JIT[n];
    blocks.push({ n, i, j, cx: SP / 2 + 2 + i * SP + jx, cy: SP / 2 + 2 + j * SP + jy, rest: (yaw * Math.PI) / 180, dots: DOTS[n] || 0 });
  }
  blocks.sort((p, q) => p.cx + p.cy - (q.cx + q.cy));
  for (const b of blocks) {
    b.grp = mk("g", {}, g);
    b.foot = mk("path", { class: "nf dash" }, b.grp);
    b.el = solid(b.grp);
    b.dEl = [];
    for (let d = 0; d < b.dots; d++) b.dEl.push(solid(b.grp));
    b.lift = spring(0, { eps: 0.02 });
    b.yaw = spring(b.rest, { eps: 0.002 });
    b.drawn = "";
  }

  function draw(b) {
    const z = clamp(b.lift.x, 0, HOP), a = b.yaw.x, key = z.toFixed(2) + "," + a.toFixed(4);
    if (key === b.drawn) return;
    b.drawn = key;
    put(b.el, prism(P, front, turn(CUBE, a, b.cx, b.cy), turn(CIN, a, b.cx, b.cy), z, z + BH));
    b.foot.setAttribute("d", z > 1.5 ? poly(ringAt(P, turn(CUBE, b.rest, b.cx, b.cy), 0)) : "");
    b.dEl.forEach((el, d) => {
      const off = b.dots === 1 ? 0 : d === 0 ? -4 : 4, ox = b.cx + off * Math.cos(a + 0.785), oy = b.cy + off * Math.sin(a + 0.785);
      put(el, prism(P, front, turn(DISC, 0, ox, oy), turn(DIN, 0, ox, oy), z + BH, z + BH + 1.4));
    });
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const b of blocks) { if (stepS(b.lift, dt)) m = true; if (stepS(b.yaw, dt)) m = true; draw(b); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    let hit = null, bd = 13;
    if (over) for (const b of blocks) { const d = Math.hypot(b.cx - over[0], b.cy - over[1]); if (d < bd) { bd = d; hit = b; } }
    for (const b of blocks) {
      const f = over ? (b === hit ? 1 : 0.7 * falloff(Math.hypot(b.cx - over[0], b.cy - over[1]) / RAD)) : 0;
      b.lift.t = HOP * f;
      b.yaw.t = b.rest + (b.rest >= 0 ? 1 : -1) * 0.4 * f;
      const on = over ? b === hit : b.n === FAV;
      b.el.sil.classList.toggle("hi", on);
      for (const el of b.dEl) el.sil.classList.toggle("hi", on);
    }
    read.textContent = hit ? "block " + (hit.i + 1) + "·" + (hit.j + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], BH);
      over = x > -6 && x < MX + 2 && y > -6 && y < MY + 2 ? [x, y] : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v * SP; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "toyblocks",
  means: "Twelve toy blocks on a play mat: the blocks near the pointer hop up and turn a little, the one under it highest.",
  rules: [1, 3, 5, 9],
  range: [1, 2, 3.5],
  tour: [[180, 124], [140, 181], [259, 205], null],
  mount,
});
