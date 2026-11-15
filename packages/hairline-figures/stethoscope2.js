/**
 * Lab balance: an analytical balance with a glass draft shield over its pan.
 * The pointer over the shield slides both side doors and the roof back,
 * opening the chamber. At rest the right door stands a little open, bright.
 * The slider is how far the doors travel.
 *
 * The pattern: panels sliding on rails (slide).
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 80, D = 60, BZ = 14, HZ = 66, TRAV = 44;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const box = (P, front, x0, y0, x1, y1, z0, z1) => { const s = Math.min(x1 - x0, y1 - y0); const [a, b] = rings(x0, y0, x1, y1, Math.min(2, s / 2), Math.min(1.2, s / 2 - 0.2)); return prism(P, front, a, b, z0, z1); };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[0, -TRAV, 0], [W, D, 0], [W, -TRAV, HZ], [0, D, HZ], [W, D, 0], [0, -TRAV, HZ]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), box(P, front, 0, 0, W, D, 0, BZ));
  put(solid(g), box(P, front, 34, 24, 46, 36, BZ, BZ + 6));
  put(solid(g), prism(P, front, disc(40, 30, 14), disc(40, 30, 12.5), BZ + 6, BZ + 7.5));
  // fixed frame: back wall and front glass
  const back = box(P, front, 2, 2, W - 2, 4, BZ, HZ), fr = box(P, front, 2, D - 4, W - 2, D - 2, BZ, HZ);
  mk("path", { d: back.sil, class: "nf lo" }, g);
  mk("path", { d: fr.sil + fr.crease, class: "nf" }, g);
  const L = mk("path", { class: "nf" }, g), R = mk("path", { class: "nf" }, g), T = mk("path", { class: "nf" }, g);
  const REST = 0.3, t = tween(REST);
  let last = NaN;
  function draw(v) {
    if (v === last) return; last = v;
    const dy = -v * TRAV * amt;
    const l = box(P, front, 2, 4 + dy, 4, D - 4 + dy, BZ, HZ - 2), r = box(P, front, W - 4, 4 + dy, W - 2, D - 4 + dy, BZ, HZ - 2), tp = box(P, front, 2, 4 + dy, W - 2, D - 4 + dy, HZ - 2, HZ);
    L.setAttribute("d", l.sil + l.crease); R.setAttribute("d", r.sil + r.crease); T.setAttribute("d", tp.sil + tp.crease);
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  const pts = [P(0, 0, 0), P(W, 0, 0), P(0, D, 0), P(W, D, 0), P(0, 0, HZ), P(W, D, HZ)];
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) - 10 && sx < Math.max(...xs) + 10 && sy > Math.min(...ys) - 10 && sy < Math.max(...ys) + 10;
  let act = null;
  function setActive(a) {
    if (a === act) return; act = a;
    tset(t, a ? 1 : REST, performance.now(), 0);
    R.classList.toggle("hi", !a); L.classList.toggle("hi", a); T.classList.toggle("hi", a);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "stethoscope2",
  means: "An analytical balance under a glass draft shield: the pointer slides its side doors and roof back to open the chamber.",
  rules: [1, 2, 5, 6],
  range: [50, 100, 100],
  tour: [[169, 163], [155, 183], [183, 168], null],
  mount,
});
