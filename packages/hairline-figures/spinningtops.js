/**
 * Spinning tops: four tops of different shapes standing on their points on a
 * table, each a turned body with a stem. Tops near the pointer tilt toward it
 * on springs and spin while the pointer moves, a groove on each crown showing
 * the turn; the one under it is bright. At rest they lean a little, one lit.
 * The slider is the reach, in table units.
 *
 * The pattern: a continuous field; the hit is each top's rest centre at its
 * own height, which never moves.
 */
const { Cam, clamp, facing, fit, hull, open, poly, prism, proj, rings, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const TOPS = [
  { c: [24, 22], body: [[0, 0], [5, 7], [9, 11], [12, 11], [14, 6]], stem: 22, lean: 0.12 },
  { c: [70, 18], body: [[0, 0], [4, 5], [9, 8], [14, 7], [18, 3]], stem: 24, lean: 0.06 },
  { c: [28, 62], body: [[0, 0], [3, 3], [5, 13], [7, 13], [8, 5]], stem: 16, lean: 0.16 },
  { c: [74, 60], body: [[0, 0], [10, 6], [16, 8], [19, 6]], stem: 25, lean: 0.09 },
];
const W = 98, FAV = 1, TILT = 0.38, NS = 20;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-4, -4, -6], [W, W - 14, -6], [W, -4, -6], [-4, W - 14, -6], [24, 22, 30], [70, 18, 30]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  { const [o, i] = rings(-4, -4, W, W - 14, 4, 1.4); put(solid(g), prism(P, front, o, i, -6, 0)); }
  const tops = TOPS.slice().map((t, k) => ({ ...t, k })).sort((a, b) => a.c[0] + a.c[1] - b.c[0] - b.c[1]).map((t) => {
    const bd = solid(g), groove = mk("path", { class: "nf lo" }, bd.g), st = solid(g);
    return { ...t, bd, groove, st, tl: spring(t.lean, { eps: 0.002 }), ph: spring(0.6 + t.k, { eps: 0.002 }), sp: spring(t.k * 1.3, { eps: 0.01 }), last: "" };
  });
  tops.sort((a, b) => a.k - b.k);

  function frame(t) {
    const a = t.tl.x, f = t.ph.x, ax = [Math.sin(a) * Math.cos(f), Math.sin(a) * Math.sin(f), Math.cos(a)];
    const e1 = [Math.cos(a) * Math.cos(f), Math.cos(a) * Math.sin(f), -Math.sin(a)], e2 = [-Math.sin(f), Math.cos(f), 0];
    return (h, r, th) => P(t.c[0] + ax[0] * h + r * (Math.cos(th) * e1[0] + Math.sin(th) * e2[0]), t.c[1] + ax[1] * h + r * (Math.cos(th) * e1[1] + Math.sin(th) * e2[1]), ax[2] * h + r * (Math.cos(th) * e1[2] + Math.sin(th) * e2[2]));
  }
  const ring = (at, h, r) => Array.from({ length: NS }, (_, i) => at(h, r, (i / NS) * 2 * Math.PI));
  function draw(t) {
    const key = [t.tl.x, t.ph.x, t.sp.x].map((v) => v.toFixed(3)).join();
    if (key === t.last) return;
    t.last = key;
    const at = frame(t), [hT, rT] = t.body[t.body.length - 1];
    t.bd.sil.setAttribute("d", poly(hull(t.body.flatMap(([h, r]) => (r ? ring(at, h, r) : [at(h, 0, 0)])))));
    t.bd.cr.setAttribute("d", poly(ring(at, hT, rT - 0.8)));
    t.groove.setAttribute("d", seg(at(hT, 2.2, t.sp.x), at(hT, rT - 1.4, t.sp.x)));
    t.st.sil.setAttribute("d", poly(hull(ring(at, hT, 1.6).concat(ring(at, t.stem, 1.6)))));
    t.st.cr.setAttribute("d", "");
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const t of tops) { for (const s of [t.tl, t.ph, t.sp]) if (stepS(s, dt)) m = true; draw(t); }
    return m;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = 14;
    for (const t of tops) { const [x, y] = HL.unproj(C, sx, sy, t.body[t.body.length - 1][0] / 2); const d = Math.hypot(x - t.c[0], y - t.c[1]); if (d < bd) { bd = d; best = t.k; } }
    return best;
  }
  let prev = null;
  function update(p) {
    const h = p ? hit(p) : -1, w = p ? HL.unproj(C, p[0], p[1], 6) : null, onT = w && w[0] > -6 && w[0] < W + 2 && w[1] > -6 && w[1] < W - 12;
    const moved = prev && p ? Math.hypot(p[0] - prev[0], p[1] - prev[1]) : 0;
    prev = p;
    for (const t of tops) {
      const d = onT ? Math.hypot(w[0] - t.c[0], w[1] - t.c[1]) : Infinity, fo = clamp(1 - d / RAD, 0, 1);
      t.tl.t = onT ? Math.max(t.lean, TILT * (t.k === h ? 1 : fo * 0.8)) : t.lean;
      if (onT && d > 0.5) t.ph.t = t.ph.x + Math.atan2(Math.sin(Math.atan2(w[1] - t.c[1], w[0] - t.c[0]) - t.ph.x), Math.cos(Math.atan2(w[1] - t.c[1], w[0] - t.c[0]) - t.ph.x));
      else if (!onT) t.ph.t = 0.6 + t.k;
      if (onT) t.sp.t += moved * 0.12 * fo;
      t.bd.sil.classList.toggle("hi", t.k === (h < 0 ? FAV : h));
    }
    read.textContent = h < 0 ? "rest" : "top " + (h + 1);
    B.wake();
  }
  bag.add(pointer(stage, { move: update, leave: () => update(null) }));
  bag.add(() => svg.replaceChildren());
  update(null);
  return { set: (v) => { RAD = v; }, destroy: bag.dispose };
}

hairline({
  name: "spinningtops",
  means: "Four spinning tops of different shapes on a table: those near the pointer tilt toward it and spin as it moves.",
  rules: [1, 3, 5, 8],
  range: [20, 40, 70],
  tour: [[193, 130], [267, 156], [210, 190], null],
  mount,
});
