/**
 * Spice rack: a two-shelf wall rack with a back board, two side boards and a
 * front rail on each shelf, holding eight round glass jars filled to their own
 * level under screw lids. The pointer picks a jar by where it stands: it lifts
 * above the rail and its lid pops up, and the jars beside it lift a little,
 * staggered from it. At rest one jar stands raised, bright. The slider is the
 * stagger.
 *
 * The pattern: one of many on two rows (riffle); the pick reads rest centres.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 15, R = 5.6, JH = 16, LH = 4, D = 14, SH = 42, LIFT = 13, POP = 8, FAV = 5;
const LEVEL = [0.7, 0.45, 0.85, 0.55, 0.6, 0.8, 0.35, 0.65];
const X1 = N * STEP + 4;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.8);
  const top = SH + 3 + JH + LIFT + LH + POP + 2;
  fit(C, [[-3, -3, 0], [X1 + 3, D, 0], [X1 + 3, -3, 0], [-3, D, 0], [0, -3, top], [X1, D, top]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 1.2, b = 0.6, par = g) => { const [a, i] = rings(x0, y0, x1, y1, r, b); const s = solid(par); put(s, prism(P, front, a, i, z0, z1)); return s; };
  box(-3, -3, X1 + 3, 0, 0, SH + 30);
  box(-3, 0, 0, D, 0, SH + 22);

  const jars = [];
  for (let s = 0; s < 2; s++) {
    const zb = s * SH;
    box(0, 0, X1, D, zb, zb + 3, 1.5, 0.8);
    for (let c = 0; c < N; c++) {
      const k = s * N + c, x = 2 + STEP / 2 + c * STEP, grp = mk("g", {}, g);
      const body = mk("path", { class: "sil" }, grp), level = mk("path", { class: "nf lo" }, grp), mouth = mk("path", { class: "nf lo" }, grp);
      const lid = solid(grp);
      jars.push({ k, s, c, x, y: D / 2, zb: zb + 3, body, level, mouth, lid, z: tween(k === FAV ? LIFT * 0.8 : 0), p: tween(k === FAV ? POP * 0.7 : 0), last: "" });
    }
    box(0, D - 1.6, X1, D, zb + 8, zb + 10, 1, 0.4);
  }
  box(X1, 0, X1 + 3, D, 0, SH + 22);

  function draw(j, lift, pop) {
    const key = lift.toFixed(2) + "," + pop.toFixed(2);
    if (key === j.last) return;
    j.last = key;
    const z0 = j.zb + lift, z1 = z0 + JH, ring = disc(j.x, j.y, R);
    j.body.setAttribute("d", poly(hull(ringAt(P, ring, z0).concat(ringAt(P, ring, z1)))));
    j.level.setAttribute("d", open(ringAt(P, run(ring, front), z0 + 2 + (JH - 5) * LEVEL[j.k])));
    j.mouth.setAttribute("d", poly(ringAt(P, disc(j.x, j.y, R - 1.2), z1)));
    put(j.lid, prism(P, front, disc(j.x, j.y, R + 0.5), disc(j.x, j.y, R - 0.6), z1 + pop, z1 + pop + LH));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const j of jars) { draw(j, tval(j.z, now), tval(j.p, now)); if (!tdone(j.z, now) || !tdone(j.p, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = jars.map((j) => P(j.x, j.y, j.zb + JH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.hypot(m[0] - sx, (m[1] - sy) * 0.6); if (dd < bd) { bd = dd; best = k; } });
    return bd < 22 ? best : -1;
  }

  let act = -2;
  const dist = (a, b) => Math.abs(jars[a].c - jars[b].c) + Math.abs(jars[a].s - jars[b].s);
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    jars.forEach((j, k) => {
      const dd = a < 0 ? 9 : dist(a, k);
      const z = a < 0 ? (k === FAV ? LIFT * 0.8 : 0) : dd === 0 ? LIFT : dd === 1 ? 3.5 : 0;
      const p = a < 0 ? (k === FAV ? POP * 0.7 : 0) : dd === 0 ? POP : dd === 1 ? 1.5 : 0;
      const delay = from < 0 ? 0 : dist(from, k) * stag;
      tset(j.z, z, now, delay); tset(j.p, p, now, delay + (dd === 0 ? 120 : 0));
      j.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "jar " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "spicerack",
  means: "Eight spice jars on a two-shelf rack: the jar under the pointer lifts and pops its lid, and its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[213, 125], [142, 196], [255, 140], null],
  mount,
});
