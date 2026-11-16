/**
 * Butter dish: a tray with a block of butter under a covered lid with a
 * knob. The pointer over the dish swings the lid up and back off the
 * tray to show the butter. At rest the lid sits ajar, bright. The slider
 * is how far the lid opens.
 */
const { Cam, fit, facing, prism, proj, rings, circ, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 64, D = 38, TZ = 3, LH = 17, REST = 6;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-4, -4, 0], [W + 4, D + 4, 0], [W + 4, -4, 0], [-4, D + 4, 0], [W / 2 - 30, D / 2, 60], [W, -10, 50]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-4, -4, W + 4, D + 4, 5, 3);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));
  const [br, bi] = rings(12, 10, W - 12, D - 10, 1, 1);
  put(solid(g), prism(P, front, br, bi, TZ, TZ + 11));
  const lid = solid(g), knob = solid(g);
  const lift = tween(REST);
  let last = NaN;
  function draw(z) {
    if (z === last) return;
    last = z;
    const dx = -z * 0.55, b = TZ + z;
    const [lr, li] = rings(dx, 0, W + dx, D, 4, 2.5);
    put(lid, prism(P, front, lr, li, b, b + LH));
    put(knob, prism(P, front, disc(W / 2 + dx, D / 2, 3.5), disc(W / 2 + dx, D / 2, 2), b + LH, b + LH + 4));
  }
  lid.sil.classList.add("hi");
  const B = register(stage, (_dt, now) => { draw(tval(lift, now)); return !tdone(lift, now); });
  bag.add(B.unregister);
  const mid = P(W / 2, D / 2, TZ);
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(lift, a ? 10 + open * 0.28 : REST, performance.now(), 0);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < 90), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (act) { tset(lift, 10 + open * 0.28, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "butterdish",
  means: "A butter dish: the lid under the pointer lifts up and back off the tray to show the block of butter beneath.",
  rules: [1, 3, 5, 6],
  range: [0, 70, 100],
  tour: [[198, 164], [214, 156], [182, 172], null],
  mount,
});
