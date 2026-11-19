/**
 * Combine harvester: a body on big front wheels with a cab, a grain tank and
 * a wide header carried on its feeder, the reel over the header. Over the
 * machine the feeder lifts the header and reel up on the 700ms ease, clear
 * of the ground; leaving lowers them to cutting height, the reel bright. The
 * slider is how high the header lifts.
 *
 * The pattern: one part answering a discrete choice (tween).
 */
const {
  Cam, fit, facing, hull, poly, seg, prism, proj, rings, rrect, clamp, rad, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = -24, L = 30, PX = 26, PZ = 24, HW = 46;
const norm = (v) => { const n = Math.hypot(...v) || 1; return v.map((x) => x / n); };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

function beam(P, a, d, len, w, h, r, b) {
  d = norm(d);
  const e1 = Math.abs(d[2]) > 0.99 ? [0, 1, 0] : norm(cross([0, 0, 1], d)), e2 = cross(d, e1);
  const at = (ring, s) => ring.map((q) => { const p = [0, 1, 2].map((j) => a[j] + d[j] * s + e1[j] * q.u + e2[j] * q.v); return P(p[0], p[1], p[2]); });
  const R = rrect(-w / 2, -h / 2, w / 2, h / 2, r, 4), I = rrect(-w / 2 + b, -h / 2 + b, w / 2 - b, h / 2 - b, Math.max(0.3, r - b), 4);
  return { sil: poly(hull(at(R, 0).concat(at(R, len)))), crease: poly(at(I, len)) };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value, on = false;
  const C = Cam(45, 0.5, 2.0);
  const tip = (a) => [PX + L * Math.cos(rad(a)), PZ + L * Math.sin(rad(a))];
  const pts = [[-44, -20, 0], [44, 20, 0], [-44, 20, 0], [24, -20, 64]];
  for (const a of [REST, 30]) { const [x, z] = tip(a); pts.push([x + 10, -HW, z - 6], [x + 10, HW, z - 6], [x, HW, z + 22], [x, -HW, z + 22]); }
  fit(C, pts, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const slab = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  const wheel = (x, y, R) => {
    const w = [];
    for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; w.push(P(x + R * Math.cos(a), y, R + R * Math.sin(a))); }
    mk("path", { d: poly(w) }, g);
  };
  wheel(-30, -18, 9); wheel(14, -18, 15);
  slab(-42, -16, 30, 16, 5, 1.6, 12, 40);
  slab(-30, -14, 4, 14, 6, 1.6, 40, 52);
  slab(10, -12, 28, 4, 4, 1.4, 40, 64);
  wheel(-30, 18, 9); wheel(14, 18, 15);
  const feeder = solid(g), header = solid(g), arm = mk("path", { class: "lo nf" }, g), reel = solid(g), bats = mk("path", { class: "lo nf" }, g);
  reel.sil.classList.add("hi");

  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const [x, z] = tip(a), d = [Math.cos(rad(a)), 0, Math.sin(rad(a))];
    put(feeder, beam(P, [PX - 4, 0, PZ], d, L + 4, 18, 10, 3, 1.2));
    put(header, beam(P, [x + 4, -HW, z], [0, 1, 0], HW * 2, 16, 9, 3, 1.2));
    const rc = [x + 8, z + 14], R = 8, ring = [], end = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; ring.push(P(rc[0] + R * Math.cos(t), -HW + 4, rc[1] + R * Math.sin(t))); end.push(P(rc[0] + R * Math.cos(t), HW - 4, rc[1] + R * Math.sin(t))); }
    put(reel, { sil: poly(hull(ring.concat(end))), crease: poly(end) });
    let b = "";
    for (let k = 0; k < 4; k++) { const t = (k / 4) * Math.PI * 2 + 0.5; b += seg(P(rc[0] + R * Math.cos(t), -HW + 4, rc[1] + R * Math.sin(t)), P(rc[0] + R * Math.cos(t), HW - 4, rc[1] + R * Math.sin(t))); }
    bats.setAttribute("d", b);
    arm.setAttribute("d", seg(P(PX - 4, 16, PZ + 10), P(rc[0], HW - 4, rc[1])));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const sp = pts.map((p) => P(...p)), X0 = Math.min(...sp.map((p) => p[0])) - 8, X1 = Math.max(...sp.map((p) => p[0])) + 8;
  const Y0 = Math.min(...sp.map((p) => p[1])) - 10, Y1 = Math.max(...sp.map((p) => p[1])) + 10;
  const say = () => { read.textContent = "lift " + Math.round(top - REST) + "°"; };
  function move([sx, sy]) {
    if (sx < X0 || sx > X1 || sy < Y0 || sy > Y1) return leave();
    on = true;
    tset(ang, top, performance.now(), 0);
    say();
    B.wake();
  }
  function leave() { on = false; tset(ang, REST, performance.now(), 0); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { top = clamp(v, 0, 30); if (on) { tset(ang, top, performance.now(), 0); say(); B.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "combine",
  means: "A combine harvester: over it the feeder lifts the wide header and its reel off the ground; the slider sets how high.",
  rules: [3, 5, 8],
  range: [0, 15, 30],
  tour: [[254, 171], [183, 238], [200, 150], null],
  mount,
});
