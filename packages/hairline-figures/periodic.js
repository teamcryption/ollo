/**
 * Science kit: a case with a hinged lid over a rack of stoppered test
 * tubes. The pointer swings the lid open on its back hinge to show the
 * tubes. At rest the lid sits ajar and one tube cap is bright.
 * The slider is how far the lid opens.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const W = 70, D = 44, H = 20;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100, act = false;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, 0, H + D], [W, 0, H + D], [W, D, H + 18]], 200, 166);
  const P = proj(C), front = facing(C);
  const cyl = (g, x, y, r, z0, z1) => { const s = solid(g); put(s, prism(P, front, disc(x, y, r), disc(x, y, r - 1), z0, z1)); return s; };
  const g = mk("g", {}, svg);
  const back = mk("g", {}, g);
  const s0 = solid(g);
  put(s0, prism(P, front, ...rings(0, 0, W, D, 5, 2), 0, H));
  const tubes = mk("g", {}, g);
  const caps = [];
  for (let i = 0; i < 6; i++) caps.push(cyl(tubes, 12 + i * 9.2, D / 2, 3.4, H, H + 5));
  const fwd = mk("g", {}, g);
  const [ring] = rings(0, 0, W, D, 5, 2);
  const t = tween(0);
  let last = NaN;
  function draw(k) {
    if (k === last) return;
    last = k;
    back.replaceChildren(); fwd.replaceChildren();
    const a = (20 + (40 + 60 * amt) * k) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
    const pts = [];
    for (const w of [0, 3]) for (const q of ring) pts.push(P(q.u, q.v * c - w * s, H + q.v * s + w * c));
    const lid = solid(a > 1.2 ? back : fwd);
    lid.sil.setAttribute("d", poly(hull(pts)));
    lid.sil.classList.toggle("hi", act);
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  const A = P(W / 2, D / 2, H + 10);
  function setActive(on) {
    if (on === act) return;
    act = on;
    last = NaN;
    tset(t, on ? 1 : 0, performance.now(), 0);
    caps[3].sil.classList.toggle("hi", !on);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  caps[3].sil.classList.add("hi");
  read.textContent = "rest";
  bag.add(pointer(stage, { move: ([x, y]) => setActive(Math.hypot(x - A[0], y - A[1]) < 140), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "periodic",
  means: "A science kit: the hinged lid swings open on its back hinge to show the rack of stoppered test tubes inside.",
  rules: [1, 4, 5, 6],
  range: [40, 70, 100],
  tour: [[200, 171], [91, 179], [317, 134], null],
  mount,
});
