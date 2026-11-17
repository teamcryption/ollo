/**
 * Punch press: a two-column press on a base, a heavy ram between the
 * columns with a punch under it, and a die on the bolster. The pointer on
 * the press drives the ram down onto the die; leaving lifts it back to its
 * half-raised rest. The slider is the stroke depth.
 */
const { Cam, circ, fit, facing, prism, proj, rings, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const REST = 52, DOWN = 22, RH = 26;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let depth = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[0, 0, 0], [64, 44, 0], [64, 0, 0], [0, 44, 0], [0, 12, 104], [64, 32, 104]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r, b, parent = g) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(parent); put(s, prism(P, front, o, i, z0, z1)); return s; };
  box(0, 0, 64, 44, 0, 10, 5, 2);
  box(18, 10, 46, 34, 10, 16, 3, 1.4);
  put(solid(g), prism(P, front, disc(32, 22, 5), disc(32, 22, 3.6), 16, 17.5));
  box(2, 15, 11, 29, 10, 92, 3, 1.2);
  const ramG = mk("g", {}, g);
  const ram = solid(ramG), punch = solid(ramG);
  ram.sil.classList.add("hi");
  box(53, 15, 62, 29, 10, 92, 3, 1.2);
  box(0, 10, 64, 34, 92, 104, 5, 2);
  const [ro, ri] = rings(12, 8, 52, 36, 5, 2);
  const tw = tween(REST);
  let last = NaN;
  function draw(z) {
    if (z === last) return;
    last = z;
    put(punch, prism(P, front, disc(32, 22, 4.5), disc(32, 22, 3), z - 8, z));
    put(ram, prism(P, front, ro, ri, z, z + RH));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const a = P(0, 44, 0), b = P(64, 0, 0), top = P(0, 22, 104)[1], bot = P(64, 44, 0)[1];
  const inside = ([sx, sy]) => sx > a[0] - 6 && sx < b[0] + 6 && sy > top - 6 && sy < bot + 6;
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(tw, v ? REST - (REST - DOWN) * depth : REST, performance.now(), 0);
    read.textContent = v ? "ram down" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inside(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { depth = v; if (on) { tset(tw, REST - (REST - DOWN) * depth, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "punchpress",
  means: "A two-column punch press: the pointer on it drives the heavy ram and punch down onto the die; leaving lifts it back.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[200, 114], [200, 205], [168, 150], null],
  mount,
});
