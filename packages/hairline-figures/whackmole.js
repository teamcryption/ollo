/**
 * Mole game: a cabinet with six holes, a mole in each. The pointer picks a
 * hole: its mole pops up and its neighbours peek, staggered by distance.
 * At rest one mole is up, bright. The slider is the stagger.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tset, tval, tdone, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 100, D = 66, H = 24, R = 9, UP = 18, FAV = 4;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const HOLES = [];
for (const y of [18, 48]) for (const x of [18, 50, 82]) HOLES.push([x, y]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [18, 18, H + UP + R], [82, 48, H + UP + R]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const order = HOLES.map((h, i) => i).sort((a, b) => HOLES[a][0] + HOLES[a][1] - HOLES[b][0] - HOLES[b][1]);
  const moles = [];
  for (const i of order) {
    const [x, y] = HOLES[i], grp = mk("g", {}, g);
    mk("path", { d: poly(ringAt(P, disc(x, y, R + 2), H)), class: "nf lo" }, grp);
    const body = mk("path", { class: "sil" }, grp);
    moles[i] = { i, x, y, body, tw: tween(i === FAV ? UP * 0.8 : 2), last: NaN };
  }
  function draw(m, z) {
    if (z === m.last) return;
    m.last = z;
    const pts = ringAt(P, disc(m.x, m.y, R), H);
    for (let k = 0; k <= 5; k++) { const t = (k / 5) * (Math.PI / 2); pts.push(...ringAt(P, disc(m.x, m.y, R * Math.cos(t)), H + z + R * 0.8 * Math.sin(t))); }
    m.body.setAttribute("d", poly(hull(pts)));
  }
  const B = register(stage, (_dt, now) => {
    let mv = false;
    for (const m of moles) { draw(m, tval(m.tw, now)); if (!tdone(m.tw, now)) mv = true; }
    return mv;
  });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const now = performance.now();
    for (const m of moles) {
      const d = a < 0 ? 0 : Math.hypot(m.x - HOLES[a][0], m.y - HOLES[a][1]) / 32;
      const z = a < 0 ? (m.i === FAV ? UP * 0.8 : 2) : m.i === a ? UP : d < 1.1 ? 6 : 1;
      tset(m.tw, z, now, a < 0 ? 0 : d * stag);
      m.body.classList.toggle("hi", m.i === (a < 0 ? FAV : a));
    }
    read.textContent = a < 0 ? "rest" : "hole " + (a + 1);
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    let best = -1, bd = 16;
    HOLES.forEach(([hx, hy], i) => { const d = Math.hypot(x - hx, y - hy); if (d < bd) { bd = d; best = i; } });
    return best;
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "whackmole",
  means: "A mole game cabinet: the pointer picks a hole and its mole pops up, the neighbours peeking after it.",
  rules: [1, 2, 5, 6],
  range: [0, 50, 100],
  tour: [[265, 172], [205, 192], [140, 180], null],
  mount,
});
