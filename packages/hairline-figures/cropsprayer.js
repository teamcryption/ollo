/**
 * Crop sprayer: a tall self-propelled sprayer, a tank and a cab on a frame
 * over four narrow wheels, its two boom arms folded forward along its sides.
 * Over the machine the arms swing open from their rear hinges on the 700ms
 * ease, out over the crop; leaving folds them back, the booms bright. The
 * slider is how far the arms open.
 *
 * The pattern: one part answering a discrete choice (tween).
 */
const {
  Cam, fit, facing, hull, poly, open, prism, proj, rings, rrect, clamp, rad, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = 16, LEN = 66, HX = -36, HY = 15, HZ = 33;
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
  const C = Cam(45, 0.5, 2.45);
  const pts = [[-40, -22, 0], [40, 22, 0], [40, -22, 0], [-40, 22, 0], [30, 0, 56]];
  for (const a of [REST, 72]) for (const s of [1, -1]) pts.push([HX + Math.cos(rad(a)) * LEN, s * (HY + Math.sin(rad(a)) * LEN), HZ]);
  fit(C, pts, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const slab = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  const wheel = (x, y) => {
    const w = [];
    for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; w.push(P(x + 13 * Math.cos(a), y, 13 + 13 * Math.sin(a))); }
    mk("path", { d: poly(w) }, g);
  };
  const farBoom = { s: solid(g), rod: mk("path", { class: "lo nf" }, g), side: -1 };
  wheel(-24, -17); wheel(24, -17);
  slab(-38, -11, 36, 11, 4, 1.4, 18, 28);
  slab(-32, -10, 6, 10, 7, 1.6, 28, 46);
  slab(12, -10, 32, 10, 4, 1.4, 28, 56);
  wheel(-24, 17); wheel(24, 17);
  const nearBoom = { s: solid(g), rod: mk("path", { class: "lo nf" }, g), side: 1 };
  const booms = [farBoom, nearBoom];
  for (const b of booms) b.s.sil.classList.add("hi");
  const hinge = mk("circle", { class: "dot m", r: 2 }, g);
  const [hx, hy] = P(HX, HY, HZ);
  hinge.setAttribute("cx", hx); hinge.setAttribute("cy", hy);

  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    for (const b of booms) {
      const d = [Math.cos(rad(a)), b.side * Math.sin(rad(a)), 0], o = [HX, b.side * HY, HZ];
      put(b.s, beam(P, o, d, LEN, 3.4, 4, 1.2, 0.8));
      const z = [];
      for (let s = 4, k = 0; s <= LEN; s += 6, k++) z.push(P(o[0] + d[0] * s, o[1] + d[1] * s, HZ - (k % 2 ? 2 : 8)));
      b.rod.setAttribute("d", open(z));
    }
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const sp = pts.map((p) => P(...p)), X0 = Math.min(...sp.map((p) => p[0])) - 8, X1 = Math.max(...sp.map((p) => p[0])) + 8;
  const Y0 = Math.min(...sp.map((p) => p[1])) - 12, Y1 = Math.max(...sp.map((p) => p[1])) + 12;
  const say = () => { read.textContent = "boom " + Math.round(top) + "°"; };
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
    set: (v) => { top = clamp(v, 40, 72); if (on) { tset(ang, top, performance.now(), 0); say(); B.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "cropsprayer",
  means: "A crop sprayer: over it the two boom arms swing open from their rear hinges; the slider sets how far they open.",
  rules: [3, 5, 8],
  range: [40, 56, 72],
  tour: [[180, 163], [217, 197], [200, 140], null],
  mount,
});
