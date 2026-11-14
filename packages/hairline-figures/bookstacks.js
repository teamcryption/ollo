/**
 * Book stacks: four piles of books lying flat on a table, each book a little
 * off square on the one below. The pointer picks a pile by where it stands:
 * its books twist round into a spiral, from the top book down, staggered,
 * and the piles beside it turn a touch. At rest one pile is half fanned, its
 * top book bright. The slider is the twist per book.
 *
 * The pattern: one of many in a single row (riffle), parts turning.
 */
const {
  Cam, fit, facing, open, prism, proj, rad, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const STEP = 50, TZ = 4, FAV = 2;
const PILES = [
  [[32, 22, 6], [30, 21, 5], [28, 20, 7], [30, 19, 5], [26, 18, 6]],
  [[34, 24, 7], [30, 22, 5], [32, 21, 6], [28, 20, 5], [30, 20, 6], [26, 18, 5], [24, 17, 5]],
  [[32, 23, 6], [30, 20, 7], [28, 21, 5], [26, 19, 6]],
  [[30, 22, 5], [32, 21, 6], [28, 20, 6], [30, 19, 5], [26, 18, 7], [24, 17, 5]],
];
const JIT = [-6, 4, -2, 7, -4, 2, -7, 5];

// a ring rotated by a about (cx, cy), normals with it
const turn = (ring, cx, cy, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: cx + (q.u - cx) * c - (q.v - cy) * s, v: cy + (q.u - cx) * s + (q.v - cy) * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tw = value;
  const C = Cam(45, 0.5, 1.72);
  const X1 = 3 * STEP + 22;
  const pts = [[-22, -22, 0], [X1, 22, 0], [X1, -22, 0], [-22, 22, 0]];
  PILES.forEach((p, k) => { const h = TZ + p.reduce((s, b) => s + b[2], 0); for (const [dx, dy] of [[-20, -20], [20, 20], [20, -20], [-20, 20]]) pts.push([k * STEP + dx, dy, h]); });
  fit(C, pts, 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-24, -24, X1 + 2, 24, 6, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));

  const piles = PILES.map((books, k) => {
    const cx = k * STEP, cy = 0, grp = mk("g", {}, g);
    let z = TZ;
    const list = books.map(([w, d, t], j) => {
      const [ring, inner] = rings(cx - w / 2, cy - d / 2, cx + w / 2, cy + d / 2, 1.2, 0.9);
      // the page block: one dim line along the fore edge, halfway up
      const edge = [{ u: cx - w / 2 + 3, v: cy + d / 2 }, { u: cx + w / 2 - 3, v: cy + d / 2 }];
      const b = { j, ring, inner, edge, z0: z, z1: z + t, jit: rad(JIT[(j + k * 3) % JIT.length]), s: solid(grp), a: tween(0), last: NaN };
      b.page = mk("path", { class: "nf lo" }, b.s.g);
      z += t;
      return b;
    });
    return { k, cx, cy, list, top: z, mid: P(cx, cy, (TZ + z) / 2) };
  });

  function draw(p, b, a) {
    if (a === b.last) return;
    b.last = a;
    const ang = b.jit + a;
    put(b.s, prism(P, front, turn(b.ring, p.cx, p.cy, ang), turn(b.inner, p.cx, p.cy, ang), b.z0, b.z1));
    const e = turn(b.edge.map((q) => ({ ...q, nu: 0, nv: 1 })), p.cx, p.cy, ang);
    b.page.setAttribute("d", open(e.map((q) => P(q.u, q.v, (b.z0 + b.z1) / 2))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of piles) for (const b of p.list) { draw(p, b, tval(b.a, now)); if (!tdone(b.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    piles.forEach((p, k) => { const dd = Math.abs(p.mid[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(piles[best].mid[1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    const on = a < 0 ? FAV : a;
    piles.forEach((p, k) => {
      const dd = Math.abs(k - on), f = a < 0 ? (k === FAV ? 0.6 : 0) : dd === 0 ? 1 : dd === 1 ? 0.18 : 0;
      const n = p.list.length - 1;
      p.list.forEach((b) => {
        tset(b.a, rad(tw) * b.j * f, now, Math.abs(n - b.j) * 45 + dd * 60);
        b.s.sil.classList.toggle("hi", k === on && b.j === n);
      });
    });
    read.textContent = a < 0 ? "rest" : "pile " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tw = v; const a = act; act = -3; setActive(a); }, destroy: bag.dispose };
}

hairline({
  name: "bookstacks",
  means: "Four piles of books on a table: the pile under the pointer twists into a spiral from the top book down.",
  rules: [1, 2, 5, 6],
  range: [4, 12, 20],
  tour: [[170, 125], [110, 100], [290, 185], null],
  mount,
});
