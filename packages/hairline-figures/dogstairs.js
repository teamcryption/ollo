/**
 * Pet steps: four carpeted steps that climb toward the back, each a drawer. The step under the pointer slides out toward the reader and the steps beside it follow a little, staggered. At rest the third step is half out, bright.
 *
 * The pattern: each moving part has a rest pose and an answer pose; the pick
 * is the part whose resting middle is nearest the pointer on screen, and the
 * others follow by distance, staggered. The slider is the stagger.
 */
const {
  Cam, facing, fit, hull, open, poly, proj, rad, rrect, run, tdone, tset, tval, tween,
  disposer, mk, pointer, register, solid,
} = HL;

// [x0, y0, x1, y1, z0, z1, radius, motion|null, name]; motion {ax, p, ang} turns about an axis through p, {d} slides
const PARTS = [[0,0,16,32,0,52,2,{"d":[0,16,0]},"step 4"],[16,0,32,32,0,39,2,{"d":[0,16,0]},"step 3"],[32,0,48,32,0,26,2,{"d":[0,16,0]},"step 2"],[48,0,64,32,0,13,2,{"d":[0,16,0]},"step 1"]];
const REST = [0.06,0,0.4,0.12], FAV = 2, FALL = [1, 0.62, 0.42, 0.3];

function xf(pt, m, t) {
  if (!m || !t) return pt;
  if (m.d) return [pt[0] + m.d[0] * t, pt[1] + m.d[1] * t, pt[2] + m.d[2] * t];
  const a = rad(m.ang * t), c = Math.cos(a), s = Math.sin(a);
  let x = pt[0] - m.p[0], y = pt[1] - m.p[1], z = pt[2] - m.p[2];
  if (m.ax === "x") [y, z] = [y * c - z * s, y * s + z * c];
  else if (m.ax === "y") [x, z] = [x * c - z * s, x * s + z * c];
  else [x, y] = [x * c - y * s, x * s + y * c];
  return [x + m.p[0], y + m.p[1], z + m.p[2]];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.75);
  const ext = [];
  for (const b of PARTS) for (const t of [0, 1]) for (const x of [b[0], b[2]]) for (const y of [b[1], b[3]]) for (const z of [b[4], b[5]]) ext.push(xf([x, y, z], b[7], t));
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const parts = PARTS.map((b, k) => {
    const r = Math.min(b[6], (b[2] - b[0]) / 2 - 0.05, (b[3] - b[1]) / 2 - 0.05);
    const bi = Math.min(1.2, (b[2] - b[0]) / 2 - 0.1, (b[3] - b[1]) / 2 - 0.1);
    const ring = rrect(b[0], b[1], b[2], b[3], r, 4), inner = rrect(b[0] + bi, b[1] + bi, b[2] - bi, b[3] - bi, Math.max(0.05, r - bi), 4);
    return { b, k, el: solid(g), ring, inner: run(inner, front), mv: b[7] ? 1 : 0, tw: tween(0), last: "" };
  });
  const movers = parts.filter((p) => p.mv);
  movers.forEach((p, i) => { p.i = i; p.tw = tween(REST[i]); });

  function draw(p, t) {
    const key = t.toFixed(3);
    if (key === p.last) return;
    p.last = key;
    const b = p.b, pts = [];
    for (const s of p.ring) { pts.push(P(...xf([s.u, s.v, b[4]], b[7], t))); pts.push(P(...xf([s.u, s.v, b[5]], b[7], t))); }
    p.el.sil.setAttribute("d", poly(hull(pts)));
    p.el.cr.setAttribute("d", open(p.inner.map((s) => P(...xf([s.u, s.v, b[5]], b[7], t)))));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of parts) { draw(p, tval(p.tw, now)); if (!tdone(p.tw, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = movers.map((p) => { const b = p.b; return P((b[0] + b[2]) / 2, (b[1] + b[3]) / 2, (b[4] + b[5]) / 2); });
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, i) => { const d = Math.hypot(m[0] - sx, m[1] - sy); if (d < bd) { bd = d; best = i; } });
    return bd < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    movers.forEach((p, i) => {
      const t = a < 0 ? REST[i] : FALL[Math.min(3, Math.abs(i - a))];
      tset(p.tw, t, now, from < 0 ? 0 : Math.abs(i - from) * stag);
      p.el.sil.classList.toggle("hi", i === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : movers[a].b[8];
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "dogstairs",
  means: "Four pet steps: the step under the pointer slides out toward you, and its neighbours follow a little in turn.",
  rules: [1, 2, 5, 8],
  range: [0, 40, 80],
  tour: [[205,110],[231,166],[250,215],null],
  mount,
});
