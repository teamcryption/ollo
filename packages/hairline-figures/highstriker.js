/**
 * High striker: a fairground strength tester. A tall rail stands on a
 * plinth with a striking pad at its foot and a bell at its crown; a puck
 * rides a collar on the rail, and a big mallet waits raised beside it.
 * The pointer swings the mallet down onto the pad and the puck shoots up
 * the rail toward the bell. At rest the bell is bright; when struck, the
 * puck is. The slider is the strength of the blow: how high the puck goes.
 *
 * The pattern: one part turning about a hinge (swing) driving a slide.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, lerp, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const TH = 168, PZ0 = 12, PH = 9, BZ = TH + 2;
const G = [40, -30, 30], UP = [-10, -20, 65], DOWN = [-24, 46, -18], ML = 56;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 1.62);
  fit(C, [[-30, -30, 0], [30, 30, 0], [30, -30, 0], [-30, 30, 0], [0, 0, BZ + 14], [34, -58, 96], [30, 30, 0], [24, 8, 4]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-30, -30, 30, 30, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, 8));
  // the pad, in front of the rail
  put(solid(g), prism(P, front, disc(16, 16, 9), disc(16, 16, 7), 8, 12));
  // the rail and its crown
  const [rr, ri] = rings(-4, -4, 4, 4, 3, 1);
  put(solid(g), prism(P, front, rr, ri, 8, TH));
  const bell = mk("path", { class: "sil" }, g);
  const bp = [];
  for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); bp.push(...disc(0, 0, 14 * Math.cos(t) + 2, 32).map((q) => P(q.u, q.v, BZ + 12 * Math.sin(t)))); }
  bell.setAttribute("d", poly(hull(bp)));
  mk("path", { d: poly(disc(0, 0, 14, 32).map((q) => P(q.u, q.v, BZ + 1))), class: "nf lo" }, g);
  const puck = solid(g), stick = mk("path", { class: "sil" }, g), head = mk("path", { class: "sil" }, g);

  function cyl(a, b, r) {
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], n = Math.hypot(...d), e = d.map((x) => x / n);
    const z = Math.abs(e[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
    let u = [e[1] * z[2] - e[2] * z[1], e[2] * z[0] - e[0] * z[2], e[0] * z[1] - e[1] * z[0]];
    const un = Math.hypot(...u); u = u.map((x) => x / un);
    const v = [u[1] * e[2] - u[2] * e[1], u[2] * e[0] - u[0] * e[2], u[0] * e[1] - u[1] * e[0]];
    const ring = (p) => Array.from({ length: 20 }, (_, i) => { const t = (i / 20) * Math.PI * 2; return P(...[0, 1, 2].map((j) => p[j] + r * (Math.cos(t) * u[j] + Math.sin(t) * v[j]))); });
    return poly(hull(ring(a).concat(ring(b))));
  }

  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const s = Math.min(1, t * 1.6), q = Math.max(0, (t - 0.25) / 0.75);
    const dv = UP.map((x, j) => lerp(x, DOWN[j], s)), dn = Math.hypot(...dv), e = dv.map((x) => x / dn);
    const tip = G.map((x, j) => x + e[j] * ML);
    stick.setAttribute("d", cyl(G, tip, 2.6));
    let hx = [e[1], -e[0], 0]; const hn = Math.hypot(...hx) || 1; hx = hx.map((x) => (x / hn) * 13);
    head.setAttribute("d", cyl(tip.map((x, j) => x - hx[j]), tip.map((x, j) => x + hx[j]), 8));
    const z = PZ0 + q * amp * (BZ - PZ0 - PH - 1);
    put(puck, prism(P, front, disc(0, 0, 9, 24), disc(0, 0, 7, 24), z, z + PH));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(4, -10, 70);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    last = NaN;
    tset(tw, on ? 1 : 0, performance.now(), 0);
    puck.sil.classList.toggle("hi", on);
    bell.classList.toggle("hi", !on);
    read.textContent = on ? Math.round(amp * 100) + "%" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => Math.abs(sx - mid[0]) < 90 && Math.abs(sy - mid[1]) < 150;
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; B.wake(); if (act) read.textContent = Math.round(amp * 100) + "%"; }, destroy: bag.dispose };
}

hairline({
  name: "highstriker",
  means: "A fairground high striker: over it, the mallet swings down on the pad and the puck shoots up the rail to the bell.",
  rules: [1, 4, 5, 8],
  range: [0.3, 1, 1],
  tour: [[182, 246], [196, 150], [182, 40], null],
  mount,
});
