/**
 * Trombone: a slide trombone lying on its side, the flared bell resting on
 * the ground, the bell section's tuning bend behind, and the long U of the
 * outer slide running out past the bell. The pointer along the slide picks
 * one of the seven slide positions: the outer slide glides out to it. At
 * rest it sits closed in first position, bright. The slider is the step between
 * positions, so how far the slide travels.
 *
 * The pattern: one part sliding along its axis, picked on a plane.
 */
const {
  Cam, clamp, fit, poly, proj, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, register,
} = HL;

const H = 13, YB = -18, TH = 1.4, REST = 0;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let step = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-48, YB - 13, 0], [-48, 9, H], [56, YB + 13, 2 * H], [172, 9, H], [172, -2, H]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);

  // a tube as a thin plate: a centreline offset each side, drawn at two heights
  function band(line, w) {
    const L = [], R = [];
    for (let i = 0; i < line.length; i++) {
      const a = line[Math.max(0, i - 1)], b = line[Math.min(line.length - 1, i + 1)];
      const dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
      L.push([line[i][0] - (dy / n) * w, line[i][1] + (dx / n) * w]);
      R.push([line[i][0] + (dy / n) * w, line[i][1] - (dx / n) * w]);
    }
    return L.concat(R.reverse());
  }
  function arc(cx, cy, r, a0, a1, n = 10) {
    const o = [];
    for (let i = 0; i <= n; i++) { const t = a0 + ((a1 - a0) * i) / n; o.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]); }
    return o;
  }
  const at = (pts, z, dx = 0) => poly(pts.map(([x, y]) => P(x + dx, y, z)));
  function plate(parent, pts, cls) {
    const lo = mk("path", { class: "sil", d: at(pts, H - TH) }, parent);
    const hi = mk("path", { class: cls || "", d: at(pts, H + TH) }, parent);
    return { lo, hi, pts };
  }

  // bell section: tube back from the slide, tuning bend, forward into the bell
  plate(g, band([[6, 0], [-36, 0]].concat(arc(-36, -9, 9, Math.PI / 2, 1.5 * Math.PI)).concat([[-36, YB], [40, YB]]), 1.3));
  plate(g, band([[-14, -1], [-14, YB + 1]], 1));
  // the bell: a flared horn on the y-z plane, its mouth facing +x
  const rr = (x) => 1.6 + 11.4 * Math.pow(clamp((x - 26) / 30, 0, 1), 2.6);
  const ring = (x) => { const o = [], r = rr(x); for (let i = 0; i < 40; i++) { const t = (i / 40) * 2 * Math.PI; o.push(P(x, YB + r * Math.cos(t), H + r * Math.sin(t))); } return o; };
  const ax = P(56, YB, H), a0 = P(26, YB, H), nx = -(ax[1] - a0[1]), ny = ax[0] - a0[0];
  const up = [], dn = [];
  for (let x = 26; x <= 56; x += 2) {
    const pts = ring(x);
    let mx = pts[0], mn = pts[0];
    for (const q of pts) { const d = q[0] * nx + q[1] * ny; if (d > mx[0] * nx + mx[1] * ny) mx = q; if (d < mn[0] * nx + mn[1] * ny) mn = q; }
    up.push(mx); dn.push(mn);
  }
  mk("path", { class: "sil", d: poly(up.concat(dn.reverse())) }, g);
  mk("path", { class: "sil", d: poly(ring(56)) }, g);
  mk("path", { class: "nf lo", d: poly(ring(55).map(([x, y], i) => { const c = P(55.5, YB, H); return [c[0] + (x - c[0]) * 0.7, c[1] + (y - c[1]) * 0.7]; })) }, g);

  // inner slide (fixed), mouthpiece, and the moving outer slide
  plate(g, band([[6, 0], [84, 0]], 1));
  plate(g, band([[-4, 7], [84, 7]], 1));
  plate(g, band([[9, 0], [9, 7]], 0.9));
  plate(g, band([[-11, 7], [-4, 7]], 1.8));
  const outer = mk("g", {}, g);
  const shape = band([[22, 0], [86, 0]].concat(arc(86, 3.5, 3.5, -Math.PI / 2, Math.PI / 2)).concat([[22, 7]]), 1.6);
  const grip = band([[30, 0], [30, 7]], 1.1);
  const o1 = plate(outer, shape, "hi"), o2 = plate(outer, grip);

  const pos = tween(REST * step);
  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    for (const o of [o1, o2]) { o.lo.setAttribute("d", at(o.pts, H - TH, d)); o.hi.setAttribute("d", at(o.pts, H + TH, d)); }
  }
  const B = register(stage, (_dt, now) => { draw(tval(pos, now)); return !tdone(pos, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    if (x < -50 || x > 170 || y < YB - 16 || y > 16) return -1;
    return clamp(Math.round((x - 40) / 18), 0, 6);
  }
  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(pos, (a < 0 ? REST : a) * step, performance.now(), 0);
    read.textContent = a < 0 ? "rest" : "pos " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { step = v; setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "trombone",
  means: "A slide trombone on its side, bell on the ground: the pointer along the slide picks one of seven positions and the slide glides out.",
  rules: [1, 3, 5, 8],
  range: [3, 9, 10],
  tour: [[198, 160], [270, 196], [342, 232], null],
  mount,
});
