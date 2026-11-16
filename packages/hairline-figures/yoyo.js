/**
 * Yo-yo: three yo-yos hang on strings from a rail. The one under the pointer slides down its string to the end; its neighbours dip a little. At rest the middle one hangs half down, bright.
 *
 * The pattern: one of many in a single row (riffle). The pointer picks a toy
 * by its rest centre's screen x; the slider is the stagger.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 46, FAV = 1, CZ = 4, PAD = 16;
const X1 = (N - 1) * STEP;
// a circle of world points round centre c, in the plane across unit axis a
function ring3(c, a, r, n = 18) {
  const h = Math.abs(a[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  let u = [a[1] * h[2] - a[2] * h[1], a[2] * h[0] - a[0] * h[2], a[0] * h[1] - a[1] * h[0]];
  const lu = Math.hypot(...u); u = u.map((q) => q / lu);
  const v = [a[1] * u[2] - a[2] * u[1], a[2] * u[0] - a[0] * u[2], a[0] * u[1] - a[1] * u[0]];
  const out = [];
  for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2, cs = Math.cos(t) * r, sn = Math.sin(t) * r; out.push([c[0] + u[0] * cs + v[0] * sn, c[1] + u[1] * cs + v[1] * sn, c[2] + u[2] * cs + v[2] * sn]); }
  return out;
}
const cyl = (a, b, r0, r1 = r0) => { const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], l = Math.hypot(...d) || 1, ax = d.map((q) => q / l); return ring3(a, ax, r0).concat(ring3(b, ax, r1)); };
const ball = (c, r) => { let o = []; for (let i = -6; i <= 6; i++) { const z = (i / 6) * r; o = o.concat(ring3([c[0], c[1], c[2] + z], [0, 0, 1], Math.sqrt(Math.max(0, r * r - z * z)) + 0.01, 28)); } return o; };
// tilt a world point about the y axis through pivot q
const tilt = (p, q, a) => [q[0] + (p[0] - q[0]) * Math.cos(a) + (p[2] - q[2]) * Math.sin(a), p[1], q[2] - (p[0] - q[0]) * Math.sin(a) + (p[2] - q[2]) * Math.cos(a)];
const HI = 2;
const TOP = 88;
function BACKDROP(P, g) {
  for (const x of [-PAD + 6, X1 + PAD - 6]) put(solid(g), { sil: poly(hull(cyl([x, 0, CZ], [x, 0, TOP], 2.2).map((p) => P(...p)))), crease: "" });
  put(solid(g), { sil: poly(hull(cyl([-PAD + 4, 0, TOP], [X1 + PAD - 4, 0, TOP], 2.6).map((p) => P(...p)))), crease: "" });
}
function PARTS(x, y, t) {
  const z = TOP - 26 - 44 * t, sw = 6 * t;
  const c = [x + sw, y, z];
  return [
    { cls: "nf lo", pts: [[x, y, TOP - 2], [c[0], y, z]], line: true },
    { cls: "sil", pts: cyl([c[0], y - 5, z], [c[0], y - 1.5, z], 11, 12) },
    { cls: "sil", pts: cyl([c[0], y + 1.5, z], [c[0], y + 5, z], 12, 11) },
  ];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[-PAD, -PAD, 0], [X1 + PAD, PAD, 0], [X1 + PAD, -PAD, 0], [-PAD, PAD, 0], [-PAD, 0, 92], [X1 + PAD, 0, 92]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-PAD, -PAD, X1 + PAD, PAD, 7, 2);
  put(solid(g), prism(P, front, br, bi, 0, CZ));
  BACKDROP(P, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g), els = [];
    items.push({ k, x, y: 0, grp, els, t: tween(k === FAV ? 0.55 : 0), last: NaN });
  }
  function draw(it, t) {
    if (t === it.last) return;
    it.last = t;
    const parts = PARTS(it.x, it.y, t);
    parts.forEach((pt, i) => {
      if (!it.els[i]) it.els[i] = mk("path", { class: pt.cls }, it.grp);
      const sp = pt.pts.map((p) => P(p[0], p[1], p[2]));
      it.els[i].setAttribute("d", pt.line ? open(sp) : pt.pts.length ? poly(hull(sp)) : "");
    });
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, CZ + 20));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), t = a < 0 ? (k === FAV ? 0.55 : 0) : dd === 0 ? 1 : dd === 1 ? 0.18 : 0;
      tset(it.t, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      draw(it, tval(it.t, now));
      it.els[HI].classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "yoyo " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "yoyo",
  means: "Three yo-yos hang from a rail: the one under the pointer runs down its string, and its neighbours dip a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[141, 165], [200, 195], [259, 225], null],
  mount,
});
