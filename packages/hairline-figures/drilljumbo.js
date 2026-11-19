/**
 * Drilling jumbo: a low wheeled tunnelling carrier with its cab at the back
 * and a long boom on a front pivot, the drill feed riding at the boom's tip
 * with its steel rod out front. Over the machine the boom swings across and
 * lifts on the 700ms ease, aiming the feed at a new hole in the face; leaving
 * parks it low and to the side, the feed bright. The slider is how far the
 * boom swings.
 *
 * The pattern: one part answering a discrete choice (tween).
 */
const {
  Cam, fit, facing, hull, poly, seg, prism, proj, rings, rrect, clamp, rad, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BL = 58, A = [24, 0, 18], REST = [-8, 3];
const norm = (v) => { const n = Math.hypot(...v) || 1; return v.map((x) => x / n); };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dir = (y, p) => [Math.cos(rad(p)) * Math.cos(rad(y)), Math.cos(rad(p)) * Math.sin(rad(y)), Math.sin(rad(p))];
const add = (a, d, s) => a.map((x, j) => x + d[j] * s);

function beam(P, a, d, len, w, h, r, b) {
  d = norm(d);
  const e1 = norm(cross([0, 0, 1], d)), e2 = cross(d, e1);
  const at = (ring, s) => ring.map((q) => { const p = [0, 1, 2].map((j) => a[j] + d[j] * s + e1[j] * q.u + e2[j] * q.v); return P(p[0], p[1], p[2]); });
  const R = rrect(-w / 2, -h / 2, w / 2, h / 2, r, 4), I = rrect(-w / 2 + b, -h / 2 + b, w / 2 - b, h / 2 - b, Math.max(0.3, r - b), 4);
  return { sil: poly(hull(at(R, 0).concat(at(R, len)))), crease: poly(at(I, len)) };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value, on = false;
  const C = Cam(45, 0.5, 2.05);
  const pts = [[-44, -16, 0], [24, 16, 0], [24, -16, 0], [-44, 16, 0], [-40, 0, 36]];
  for (const [y, p] of [REST, [-88, 24], [-38, 24]]) { const d = dir(y, p); pts.push(add(A, d, BL + 48)); }
  fit(C, pts, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const slab = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  const wheel = (x, y) => { const w = []; for (let i = 0; i < 18; i++) { const a = (i / 18) * Math.PI * 2; w.push(P(x + 7 * Math.cos(a), y, 7 + 7 * Math.sin(a))); } mk("path", { d: poly(w), class: "sil" }, g); };
  for (const x of [-30, 12]) wheel(x, -14);
  slab(-42, -13, 22, 13, 4, 1.4, 6, 15);
  slab(-41, -12, -21, 4, 3, 1.2, 15, 34);
  slab(-43, -14, -19, 6, 2, 0.8, 34, 37);
  slab(14, -6, 26, 6, 2.5, 1, 15, 21);
  for (const x of [-30, 12]) wheel(x, 14);
  const ram = mk("path", { class: "lo nf" }, g);
  const boom = solid(g), feed = solid(g);
  feed.sil.classList.add("hi");
  const rod = mk("path", { class: "nf" }, g), bit = mk("circle", { class: "dot", r: 2 }, g);
  const pivot = mk("circle", { class: "dot m", r: 2.2 }, g);
  const [hx, hy] = P(...A);
  pivot.setAttribute("cx", hx); pivot.setAttribute("cy", hy);

  const sw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const y = REST[0] - top * t, p = REST[1] + (24 - REST[1]) * t, d = dir(y, p);
    const e1 = norm(cross([0, 0, 1], d)), up = cross(d, e1), E = add(A, d, BL), F = add(E, up, 6);
    put(boom, beam(P, A, d, BL, 8, 7, 2.5, 1.2));
    put(feed, beam(P, add(F, d, -18), d, 52, 6, 5, 1.8, 1));
    const r0 = add(F, d, 34), r1 = add(F, d, 48);
    rod.setAttribute("d", seg(P(...r0), P(...r1)));
    bit.setAttribute("cx", P(...r1)[0]); bit.setAttribute("cy", P(...r1)[1]);
    ram.setAttribute("d", seg(P(4, 0, 15), P(...add(A, d, 26))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(sw, now)); return !tdone(sw, now); });
  bag.add(B.unregister);

  const sp = pts.map((p) => P(...p)), X0 = Math.min(...sp.map((p) => p[0])) - 10, X1 = Math.max(...sp.map((p) => p[0])) + 10;
  const Y0 = Math.min(...sp.map((p) => p[1])) - 10, Y1 = Math.max(...sp.map((p) => p[1])) + 10;
  const say = () => { read.textContent = "boom " + Math.round(top) + "°"; };
  function move([sx, sy]) {
    if (sx < X0 || sx > X1 || sy < Y0 || sy > Y1) return leave();
    on = true;
    tset(sw, 1, performance.now(), 0);
    say();
    B.wake();
  }
  function leave() { on = false; tset(sw, 0, performance.now(), 0); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { top = clamp(v, 30, 80); last = NaN; if (on) say(); B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "drilljumbo",
  means: "A tunnelling drill jumbo: over it the boom swings across and lifts to aim its drill feed; the slider sets how far it swings.",
  rules: [3, 5, 8],
  range: [30, 55, 80],
  tour: [[128, 198], [150, 205], [105, 180], null],
  mount,
});
