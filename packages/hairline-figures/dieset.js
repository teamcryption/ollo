/**
 * Die press: a base with a lower die, four guide posts and a crown. The ram plate hangs between the posts, bright; the pointer brings it down onto the die. The slider is the stroke.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const S = 1.75, REST = 0.15;
const FIT = [[0,0,0],[84,52,0],[0,0,96],[84,52,96]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, S);
  fit(C, FIT, 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 2, b = 1.2) => { const [a, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, a, i, z0, z1)); };
  const cyl = (x, y, R, z0, z1) => { const d = (r) => circ(r, 24).map((q) => ({ ...q, u: q.u + x, v: q.v + y })); put(solid(g), prism(P, front, d(R), d(R - 1.2), z0, z1)); };
  const tb = (x0, y0, x1, y1, z0, z1, r, xf) => { const pts = []; for (const z of [z0, z1]) for (const q of rrect(x0, y0, x1, y1, r, 3)) { const w = xf([q.u, q.v, z]); pts.push(P(w[0], w[1], w[2])); } return poly(hull(pts)); };
  const rot = (px, pz, a) => ([x, y, z]) => [px + (x - px) * Math.cos(a) - (z - pz) * Math.sin(a), y, pz + (x - px) * Math.sin(a) + (z - pz) * Math.cos(a)];
  const mover = () => { const s = solid(g); s.sil.classList.add("hi"); return s; };
  let parts = null;
  const build = () => {
    box(0, 0, 84, 52, 0, 10, 4, 1.6);
    box(26, 14, 58, 38, 10, 18, 2, 1);
    cyl(6, 6, 4, 10, 86); cyl(6, 46, 4, 10, 86);
    const ram = mover(); const pin = mover();
    cyl(78, 6, 4, 10, 86); cyl(78, 46, 4, 10, 86);
    box(0, 0, 84, 52, 86, 96, 4, 1.6);
    parts = (q) => { const h = 70 - 50 * q; const id = (p) => p;
      ram.sil.setAttribute("d", tb(12, 4, 72, 48, h, h + 12, 3, id));
      pin.sil.setAttribute("d", tb(30, 16, 54, 36, h - 6, h, 2, id)); };
  };
  build();
  const tw = tween(REST);
  let last = NaN;
  const B = register(stage, (_dt, now) => {
    const q = tval(tw, now);
    if (q !== last) { last = q; parts(q); }
    return !tdone(tw, now);
  });
  bag.add(B.unregister);
  const pts = FIT.map((p) => P(p[0], p[1], p[2]));
  const bx = [Math.min(...pts.map((p) => p[0])), Math.max(...pts.map((p) => p[0])), Math.min(...pts.map((p) => p[1])), Math.max(...pts.map((p) => p[1]))];
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? amt : REST, performance.now(), 0);
    read.textContent = on ? "ram" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(sx > bx[0] && sx < bx[1] && sy > bx[2] && sy < bx[3]), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { tset(tw, amt, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "dieset",
  means: "a base with a lower die, four guide posts and a crown. The ram plate hangs between the posts, bright; the pointer brings it down onto the ",
  rules: [1, 4, 5, 8],
  range: [0.5,0.9,1],
  tour: [[200,123],[180,180],[220,131],null],
  mount,
});
