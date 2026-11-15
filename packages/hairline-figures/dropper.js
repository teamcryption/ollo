/**
 * Pipette: a hand pipette over a rack of three tubes. The pointer over it
 * slides the pipette down into the middle tube and presses its plunger.
 * At rest it hovers above the rack, its plunger button bright. The slider
 * is how far the plunger goes.
 *
 * The pattern: a tool dipping on its axis (slide).
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const RZ = 16, TZ = 40, UP = 46, DOWN = 22;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, 0], [60, 20, 0], [60, 0, 0], [0, 20, 0], [30, 10, UP + 76]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [ra, rb] = rings(0, 0, 60, 20, 3, 1.2);
  put(solid(g), prism(P, front, ra, rb, 0, RZ));
  const pg = mk("g", {}, g);
  const tip = mk("path", { class: "sil" }, pg), body = solid(pg), grip = solid(pg), rod = solid(pg), btn = solid(pg);
  for (const x of [12, 30, 48]) { const p = prism(P, front, disc(x, 10, 4.5), disc(x, 10, 3.7), RZ, TZ); mk("path", { d: p.sil + p.crease, class: "nf" }, g); }
  const t = tween(0); let last = NaN;
  function draw(v) {
    if (v === last) return; last = v;
    const z = UP + (DOWN - UP) * v, press = 7 * v * amt;
    tip.setAttribute("d", poly(hull(ringAt(P, disc(30, 10, 0.8, 12), z).concat(ringAt(P, disc(30, 10, 3, 20), z + 16)))));
    put(body, prism(P, front, disc(30, 10, 5), disc(30, 10, 4), z + 16, z + 50));
    put(grip, prism(P, front, disc(30, 10, 6.5), disc(30, 10, 5.5), z + 50, z + 58));
    put(rod, prism(P, front, disc(30, 10, 1.8, 16), disc(30, 10, 1.2, 16), z + 58, z + 72 - press));
    put(btn, prism(P, front, disc(30, 10, 4), disc(30, 10, 3), z + 72 - press, z + 76 - press));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  const a = P(0, 20, 0), b = P(60, 0, 0), c = P(30, 10, UP + 80);
  const inside = ([sx, sy]) => sx > a[0] - 10 && sx < b[0] + 10 && sy > c[1] - 10 && sy < Math.max(a[1], b[1]) + 30;
  let act = null;
  function setActive(on) {
    if (on === act) return; act = on;
    tset(t, on ? 1 : 0, performance.now(), 0);
    btn.sil.classList.toggle("hi", !on); tip.classList.toggle("hi", on);
    read.textContent = on ? "draw" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "dropper",
  means: "A hand pipette over a tube rack: the pointer slides it down into the middle tube and presses its plunger to draw.",
  rules: [1, 2, 5, 6],
  range: [40, 100, 100],
  tour: [[200, 146], [167, 233], [233, 266], null],
  mount,
});
