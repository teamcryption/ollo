/**
 * Orrery: a round base with a centre post carrying the sun, and four arms
 * each holding a planet on a short stem. The pointer turns the arms round
 * the sun, inner planets faster. At rest the third planet is bright.
 * The slider is how far the planets travel.
 */
const { Cam, circ, fit, facing, hull, open, poly, prism, proj, ringAt, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const PL = [[16, 3, 0.3, 2.2], [26, 4, 2.0, 1.6], [37, 5, 3.6, 1.1], [48, 3.5, 5.0, 0.7]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100, act = false;
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[-52, 0, 30], [52, 0, 30], [0, -52, 30], [0, 52, 30], [0, 0, 0], [0, 0, 58]], 200, 166);
  const P = proj(C), front = facing(C);
  const cyl = (g, x, y, r, z0, z1) => { const s = solid(g); put(s, prism(P, front, disc(x, y, r), disc(x, y, r - 1), z0, z1)); return s; };
  const ball = (g, x, y, z, r) => { const s = solid(g), pts = []; for (let i = -3; i <= 3; i++) { const a = (i / 3) * (Math.PI / 2); pts.push(...ringAt(P, disc(x, y, r * Math.cos(a), 20), z + r * Math.sin(a))); } s.sil.setAttribute("d", poly(hull(pts))); return s; };
  const g = mk("g", {}, svg);
  cyl(g, 0, 0, 20, 0, 6);
  const mv = mk("g", {}, g);
  const t = tween(0);
  let last = NaN;
  function draw(k) {
    if (k === last) return;
    last = k;
    mv.replaceChildren();
    const items = [{ d: 0, f: () => { cyl(mv, 0, 0, 2, 6, 40); ball(mv, 0, 0, 48, 8); } }];
    PL.forEach(([R, r, a0, w], i) => {
      const a = a0 + w * 2.6 * amt * k, x = R * Math.cos(a), y = R * Math.sin(a), z = 34 - i * 5;
      items.push({ d: x + y, f: () => {
        mk("path", { d: open([P(0, 0, z), P(x, y, z)]), class: "nf" }, mv);
        mk("path", { d: open([P(x, y, z), P(x, y, z + 6)]), class: "nf" }, mv);
        const b = ball(mv, x, y, z + 6 + r, r);
        if (i === 2 || (act && i === 3)) b.sil.classList.toggle("hi", act ? i === 3 : i === 2);
      } });
    });
    items.sort((p, q) => p.d - q.d).forEach((it) => it.f());
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  const A = P(0, 0, 30);
  function setActive(on) {
    if (on === act) return;
    act = on;
    last = NaN;
    tset(t, on ? 1 : 0, performance.now(), 0);
    read.textContent = on ? "orbit" : "rest";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: ([x, y]) => setActive(Math.hypot(x - A[0], y - A[1]) < 140), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "solarsystem",
  means: "An orrery: four arms round a sun on a post turn under the pointer, carrying their planets on orbits, inner ones faster.",
  rules: [1, 4, 5, 8],
  range: [40, 70, 100],
  tour: [[200, 164], [121, 124], [279, 203], null],
  mount,
});
