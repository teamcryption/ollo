/**
 * Rabbit tunnel: a play tunnel of four hoop sections on the floor. The pointer picks a section: it slides up off the floor to open the tunnel, neighbours rise a little.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NB = 0.3, N = 4, STEP = 26, W = 15, FAV = 1, CZ = 4, H = 34;
const X1 = (N - 1) * STEP + 2 * W;
const ring = (x, y, r, z, n = 24) => { const a = []; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; a.push([x + r * Math.cos(t), y + r * Math.sin(t), z]); } return a; };
const cyl = (x, y, r, z0, z1) => ring(x, y, r, z0).concat(ring(x, y, r, z1));
const sph = (x, y, r, z) => { const a = []; for (let i = -3; i <= 3; i++) { const p = (i / 3) * (Math.PI / 2); a.push(...ring(x, y, r * Math.cos(p), z + r * Math.sin(p), 16)); } return a; };
const box = (x0, y0, x1, y1, z0, z1) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
const SPINE = () => [];
const arc = (x, r, z) => { const a = []; for (let i = 0; i <= 16; i++) { const t = (i / 16) * Math.PI; a.push([x, 15 - r * Math.cos(t), z + r * Math.sin(t)]); } return a; };
const still = (x) => [];
const move = (x, v) => { const z = CZ + v * 16; return [{ pts: arc(x - 12, 14, z).concat(arc(x + 12, 14, z)), sil: 1 }, { pts: arc(x + 12, 14, z), nf: 1, open: 1 }, { pts: arc(x + 12, 10, z), nf: 1, open: 1 }, { pts: arc(x, 14, z), nf: 1, open: 1, lo: 1 }]; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-6, -6, 0], [X1 + 6, 2 * W + 6, 0], [X1 + 6, -6, 0], [-6, 2 * W + 6, 0], [W, W, CZ + H], [X1 - W, W, CZ + H], [X1 / 2, 0, CZ + H]], 200, 168);
  const P = proj(C), front = facing(C);
  const shape = (pts) => hull(pts.map(([x, y, z]) => P(x, y, z)));
  const line = (pts) => pts.map(([x, y, z]) => P(x, y, z));
  const path = (s) => poly(s.open !== undefined ? line(s.pts) : shape(s.pts));
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-6, -6, X1 + 6, 2 * W + 6, 6, 2);
  put(solid(g), prism(P, front, cr, ci, 0, CZ));
  for (const s of SPINE()) mk("path", { d: path(s) }, g);
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = W + k * STEP, grp = mk("g", {}, g), hi = [];
    for (const s of still(x)) { const el = mk("path", { d: path(s), class: s.sil ? "sil" : s.nf ? "nf" : "" }, grp); if (s.sil) hi.push(el); }
    const parts = move(x, 0).map((s) => { const el = mk("path", { class: s.sil ? "sil" : s.nf ? (s.lo ? "nf lo" : "nf") : "" }, grp); if (s.sil) hi.push(el); return el; });
    items.push({ k, x, parts, hi, v: tween(k === FAV ? 0.7 : 0), last: NaN });
  }
  function draw(it, v) {
    if (v === it.last) return;
    it.last = v;
    move(it.x, v).forEach((s, i) => it.parts[i].setAttribute("d", path(s)));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.v, now)); if (!tdone(it.v, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);
  const mids = items.map((it) => P(it.x, W, CZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 100 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), v = a < 0 ? (k === FAV ? 0.7 : 0) : dd === 0 ? 1 : dd === 1 ? NB : dd === 2 ? NB / 2 : 0;
      tset(it.v, v, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      for (const el of it.hi) el.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "hoop " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "hayrack2",
  means: "a play tunnel of four hoop sections on the floor. The pointer picks a section",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[137,121],[179,142],[263,185],null],
  mount,
});
