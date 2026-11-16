/**
 * Horseshoe magnet: a U-shaped magnet lying on its side with capped poles,
 * facing a loose steel keeper bar. The pointer pulls the two together: the
 * magnet slides across the gap to the keeper. At rest the keeper is bright.
 * The slider is how far the magnet travels.
 */
const { Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100, act = false;
  const C = Cam(45, 0.5, 2.95);
  fit(C, [[0, 0, 0], [92, 34, 0], [92, 0, 12], [0, 34, 12], [0, 0, 12]], 200, 166);
  const P = proj(C), front = facing(C);
  const box = (g, x0, y0, x1, y1, z0, z1, r = 3) => { const s = solid(g); put(s, prism(P, front, ...rings(x0, y0, x1, y1, r, 1.5), z0, z1)); return s; };
  const g = mk("g", {}, svg);
  const mv = mk("g", {}, g);
  const keeper = box(g, 82, -2, 90, 36, 0, 7, 2);
  const t = tween(0);
  let last = NaN;
  function draw(k) {
    if (k === last) return;
    last = k;
    mv.replaceChildren();
    const d = 15 * amt * k;
    box(mv, d, 0, 18 + d, 34, 0, 11, 9);
    box(mv, 8 + d, 0, 58 + d, 11, 0, 11, 3);
    box(mv, 56 + d, 0, 66 + d, 11, 0, 11, 2);
    box(mv, 8 + d, 23, 58 + d, 34, 0, 11, 3);
    const cap = box(mv, 56 + d, 23, 66 + d, 34, 0, 11, 2);
    cap.sil.classList.toggle("hi", act);
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  const A = P(46, 17, 11);
  function setActive(on) {
    if (on === act) return;
    act = on;
    last = NaN;
    tset(t, on ? 1 : 0, performance.now(), 0);
    keeper.sil.classList.toggle("hi", !on);
    read.textContent = on ? "pull" : "rest";
    B.wake();
  }
  keeper.sil.classList.add("hi");
  read.textContent = "rest";
  bag.add(pointer(stage, { move: ([x, y]) => setActive(Math.hypot(x - A[0], y - A[1]) < 140), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "magnet",
  means: "A horseshoe magnet lying on its side: the pointer pulls it across the gap until its poles meet the steel keeper bar.",
  rules: [1, 4, 5, 8],
  range: [40, 70, 100],
  tour: [[200, 153], [94, 127], [319, 187], null],
  mount,
});
