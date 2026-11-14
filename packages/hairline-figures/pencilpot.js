/**
 * Crayon cups: three round cups on a tray, each holding three crayons of
 * different lengths. The pointer picks a cup by where it stands: its crayons
 * slide up out of the cup, and the cups beside it lift theirs a little,
 * staggered from it. At rest the first cup's crayons stand raised, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 38, R = 13, H = 22, TZ = 4, LIFT = 20, FAV = 0, CR = 2.8;
const X1 = (N - 1) * STEP;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
// crayons in each cup, far to near: [dx, dy, length]
const CRAY = [[[-4, -4, 30], [5, -2, 24], [-2, 5, 34]], [[3, -5, 34], [-5, 1, 28], [4, 5, 22]], [[-3, -4, 26], [5, 0, 32], [-4, 5, 28]]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.15);
  const top = TZ + 2 + 34 + 4 + LIFT;
  fit(C, [[-R - 6, -R - 6, 0], [X1 + R + 6, R + 6, 0], [X1 + R + 6, -R - 6, 0], [-R - 6, R + 6, 0], [0, 0, top], [X1, 0, top]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-R - 6, -R - 6, X1 + R + 6, R + 6, 8, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));

  const cups = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, y = 0, grp = mk("g", {}, g);
    const ring = disc(x, y, R), fr = run(ring, front);
    put(solid(grp), prism(P, front, ring, disc(x, y, R - 2), TZ, TZ + H));
    const cg = mk("g", {}, grp);
    const crs = CRAY[k].map(([dx, dy, len]) => ({ x: x + dx, y: y + dy, len, s: solid(cg) }));
    const wall = mk("path", { class: "sil", d: poly(ringAt(P, fr, TZ + H).concat(ringAt(P, fr, TZ).reverse())) }, grp);
    cups.push({ k, crs, wall, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN });
  }

  function draw(c, lift) {
    if (lift === c.last) return;
    c.last = lift;
    c.crs.forEach((cr, j) => {
      const z0 = TZ + 2 + lift * (1 - 0.18 * j), z1 = z0 + cr.len, ring = disc(cr.x, cr.y, CR, 16);
      const sil = poly(hull(ringAt(P, ring, z0).concat(ringAt(P, ring, z1), [P(cr.x, cr.y, z1 + 5)])));
      put(cr.s, { sil, crease: open(ringAt(P, run(ring, front), z1 - 3)) });
    });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const c of cups) { draw(c, tval(c.z, now)); if (!tdone(c.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = cups.map((c) => P(c.k * STEP, 0, TZ + H));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    cups.forEach((c, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(c.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      c.wall.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "cup " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "pencilpot",
  means: "Three crayon cups on a tray: the cup under the pointer pushes its crayons up, and its neighbours lift theirs a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[142, 106], [200, 135], [258, 164], null],
  mount,
});
