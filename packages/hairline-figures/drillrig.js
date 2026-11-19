/**
 * Drilling rig: a tracked carrier with a cab and a long mast folded back
 * over its deck, the auger running along it. Over the machine the mast
 * swings up on its front pivot on the 700ms ease, pushed by its ram; leaving
 * folds it back to a low lean, the mast bright. The slider is the mast's
 * raise angle.
 *
 * The pattern: one part answering a discrete choice (tween).
 */
const {
  Cam, fit, facing, hull, poly, open, seg, prism, proj, rings, rrect, clamp, rad, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = 22, LEN = 104, PX = 30, PZ = 20;
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
  const C = Cam(45, 0.5, 1.95);
  const dir = (e) => [-Math.cos(rad(e)), 0, Math.sin(rad(e))];
  const pts = [[-44, -24, 0], [44, 24, 0], [44, -24, 0], [-44, 24, 0]];
  for (const e of [REST, 90]) { const d = dir(e); pts.push([PX + d[0] * LEN, 0, PZ + d[2] * LEN + 5]); }
  fit(C, pts, 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const slab = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  slab(-42, -23, 42, -12, 5, 1.5, 0, 11);
  slab(-26, -20, -6, -6, 3, 1.2, 18, 38);
  slab(-38, -15, 38, 15, 4, 1.5, 11, 19);
  slab(-42, 12, 42, 23, 5, 1.5, 0, 11);
  for (const x of [-32, 32]) {
    const w = [];
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; w.push(P(x + 4 * Math.cos(a), 23, 5.5 + 4 * Math.sin(a))); }
    mk("path", { d: poly(w), class: "lo nf" }, g);
  }
  const ram = mk("path", { class: "lo nf" }, g);
  const mast = solid(g);
  mast.sil.classList.add("hi");
  const auger = mk("path", { class: "nf" }, g), head = solid(g);
  const pivot = mk("circle", { class: "dot m", r: 2.2 }, g);
  const [hx, hy] = P(PX, 0, PZ);
  pivot.setAttribute("cx", hx); pivot.setAttribute("cy", hy);

  const ang = tween(REST);
  let last = NaN;
  function draw(e) {
    if (e === last) return;
    last = e;
    const d = dir(e), a = [PX, 0, PZ], pt = (s, off, up) => P(PX + d[0] * s + Math.sin(rad(e)) * up, off, PZ + d[2] * s + Math.cos(rad(e)) * up);
    put(mast, beam(P, a, d, LEN, 9, 6, 2, 1.2));
    const z = [];
    for (let s = 8; s <= LEN - 14; s += 4) z.push(pt(s, 7.5 + ((s / 4) % 2 ? 2 : -2), 0));
    auger.setAttribute("d", open(z));
    put(head, beam(P, [PX + d[0] * 40, 0, PZ + d[2] * 40], d, 14, 15, 10, 3, 1.4));
    ram.setAttribute("d", seg(P(PX - 30, 0, 19), pt(34, 0, 0)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const sp = pts.map((p) => P(...p)), X0 = Math.min(...sp.map((p) => p[0])) - 10, X1 = Math.max(...sp.map((p) => p[0])) + 10;
  const Y0 = Math.min(...sp.map((p) => p[1])) - 10, Y1 = Math.max(...sp.map((p) => p[1])) + 10;
  function move([sx, sy]) {
    if (sx < X0 || sx > X1 || sy < Y0 || sy > Y1) return leave();
    on = true;
    tset(ang, top, performance.now(), 0);
    read.textContent = "mast " + Math.round(top) + "°";
    B.wake();
  }
  function leave() { on = false; tset(ang, REST, performance.now(), 0); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { top = clamp(v, 50, 90); if (on) { tset(ang, top, performance.now(), 0); read.textContent = "mast " + Math.round(top) + "°"; B.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "drillrig",
  means: "A tracked drilling rig: over it the long mast swings up from the deck to stand; the slider sets how far it rises.",
  rules: [3, 5, 8],
  range: [50, 70, 90],
  tour: [[166, 157], [205, 205], [130, 120], null],
  mount,
});
