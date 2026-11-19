/**
 * Pedestal rock breaker: a slewing boom on a round pedestal beside a grizzly,
 * the grate where oversize rocks hang up, and a hydraulic hammer on the end
 * of its stick. Over the grizzly the boom slews round on the 700ms ease and
 * the stick drops the hammer onto the rocks; leaving parks it out to the
 * side, hammer raised and bright. The slider is how far the boom slews.
 *
 * The pattern: one part answering a discrete choice (tween).
 */
const {
  Cam, circ, fit, facing, hull, poly, seg, prism, proj, rings, rrect, clamp, rad, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = [-12, -12, 40], BL = 46, SL = 30, YR = -100;
const norm = (v) => { const n = Math.hypot(...v) || 1; return v.map((x) => x / n); };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dir = (y, p) => [Math.cos(rad(p)) * Math.cos(rad(y)), Math.cos(rad(p)) * Math.sin(rad(y)), Math.sin(rad(p))];
const add = (a, d, s) => a.map((x, j) => x + d[j] * s);
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function beam(P, a, d, len, w, h, r, b) {
  d = norm(d);
  const e1 = Math.abs(d[2]) > 0.99 ? [0, 1, 0] : norm(cross([0, 0, 1], d)), e2 = cross(d, e1);
  const at = (ring, s) => ring.map((q) => { const p = [0, 1, 2].map((j) => a[j] + d[j] * s + e1[j] * q.u + e2[j] * q.v); return P(p[0], p[1], p[2]); });
  const R = rrect(-w / 2, -h / 2, w / 2, h / 2, r, 4), I = rrect(-w / 2 + b, -h / 2 + b, w / 2 - b, h / 2 - b, Math.max(0.3, r - b), 4);
  return { sil: poly(hull(at(R, 0).concat(at(R, len)))), crease: poly(at(I, len)) };
}

function pose(t, top) {
  const y = YR + top * t, b = dir(y, 28 - 10 * t), K = add(H, b, BL), s = dir(y, -38 - 38 * t), T = add(K, s, SL);
  return { b, K, s, T };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value, on = false;
  const C = Cam(45, 0.5, 2.0);
  const pts = [[0, -20, 0], [56, 36, 0], [56, -20, 0], [0, 36, 0], [-20, -20, 0]];
  for (const v of [75, 125]) for (const t of [0, 1]) { const q = pose(t, v); pts.push(q.K, add(q.T, q.s, 16)); }
  fit(C, pts, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(-22, -22, -2, -2, 3, 1.2), 0, 4));
  put(solid(g), prism(P, front, disc(-12, -12, 5.5), disc(-12, -12, 4.5), 4, 34));
  put(solid(g), prism(P, front, disc(-12, -12, 8), disc(-12, -12, 6.8), 34, 40));
  put(solid(g), prism(P, front, ...rings(0, -20, 56, 36, 4, 1.5), 0, 10));
  const bars = [];
  for (let y = -12; y <= 28; y += 8) bars.push(seg(P(4, y, 10.2), P(52, y, 10.2)));
  mk("path", { class: "lo nf", d: bars.join("") }, g);
  for (const [x, y, r] of [[40, -6, 5], [24, 12, 5.5], [44, 16, 4]]) put(solid(g), prism(P, front, disc(x, y, r, 16), null, 10, 10 + r * 0.9));
  const ram = mk("path", { class: "lo nf" }, g);
  const boom = solid(g), stick = solid(g), hammer = solid(g);
  hammer.sil.classList.add("hi");
  const pin = mk("circle", { class: "dot m", r: 2 }, g), tip = mk("circle", { class: "dot", r: 2 }, g);

  const sw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const { b, K, s, T } = pose(t, top);
    put(boom, beam(P, H, b, BL + 3, 7, 7, 2.5, 1.2));
    put(stick, beam(P, K, s, SL, 5.5, 5.5, 2, 1));
    put(hammer, beam(P, T, s, 14, 8, 8, 2.5, 1.2));
    ram.setAttribute("d", seg(P(H[0], H[1], 30), P(...add(H, b, 22))));
    const [kx, ky] = P(...K), [ex, ey] = P(...add(T, s, 18));
    pin.setAttribute("cx", kx); pin.setAttribute("cy", ky);
    tip.setAttribute("cx", ex); tip.setAttribute("cy", ey);
  }
  const B = register(stage, (_dt, now) => { draw(tval(sw, now)); return !tdone(sw, now); });
  bag.add(B.unregister);

  const sp = pts.map((p) => P(...p)), X0 = Math.min(...sp.map((p) => p[0])) - 10, X1 = Math.max(...sp.map((p) => p[0])) + 10;
  const Y0 = Math.min(...sp.map((p) => p[1])) - 10, Y1 = Math.max(...sp.map((p) => p[1])) + 10;
  const say = () => { read.textContent = "slew " + Math.round(top) + "°"; };
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
    set: (v) => { top = clamp(v, 75, 125); last = NaN; if (on) say(); B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "rockbreaker",
  means: "A pedestal rock breaker by a grizzly: over it the boom slews round and drops its hammer on the rocks; the slider sets the slew.",
  rules: [3, 5, 8],
  range: [75, 100, 125],
  tour: [[200, 214], [228, 204], [172, 220], null],
  mount,
});
