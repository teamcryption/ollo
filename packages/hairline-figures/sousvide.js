/**
 * Sous vide stick: a pot of water with an immersion circulator clipped to
 * its rim. The pointer over the pot slides the stick up out of the water
 * along its clip. At rest the stick sits clipped in, bright. The slider is
 * how far it rises.
 */
const { Cam, fit, facing, prism, proj, circ, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const R = 24, PZ = 28, SX = 16, SY = -13, REST = 3;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-R - 4, -R - 4, 0], [R + 4, R + 4, 0], [-R, R, 0], [R, -R, 0], [SX, SY, 95]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-R - 6, -R - 6, R + 6, R + 6, 6, 2);
  put(solid(g), prism(P, front, cr, ci, 0, 2));
  const stick = solid(g), clip = solid(g);
  put(solid(g), prism(P, front, disc(0, 0, R), disc(0, 0, R - 2), 2, PZ));
  const front2 = mk("g", {}, g);
  const shead = solid(front2), sclip = solid(front2);
  const lift = tween(REST);
  let last = NaN;
  function draw(z) {
    if (z === last) return;
    last = z;
    put(stick, prism(P, front, disc(SX, SY, 4.5, 20), disc(SX, SY, 3.5, 20), 8 + z, PZ + 10 + z));
    put(clip, prism(P, front, disc(SX + 3, SY - 3, 1, 8), disc(SX + 3, SY - 3, 0.5, 8), PZ - 2, PZ + 3));
    put(shead, prism(P, front, disc(SX, SY, 6.5, 24), disc(SX, SY, 5, 24), PZ + 10 + z, PZ + 30 + z));
    put(sclip, prism(P, front, disc(SX, SY, 7.5, 24), disc(SX, SY, 6, 24), PZ + 1, PZ + 4));
  }
  shead.sil.classList.add("hi");
  const B = register(stage, (_dt, now) => { draw(tval(lift, now)); return !tdone(lift, now); });
  bag.add(B.unregister);
  const mid = P(0, 0, PZ);
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(lift, a ? 12 + open * 0.25 : REST, performance.now(), 0);
    read.textContent = a ? "lifted" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < 95), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (act) { tset(lift, 12 + open * 0.25, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "sousvide",
  means: "A sous vide stick clipped to a pot: the pointer over the pot slides the stick up along its clip, out of the water.",
  rules: [1, 3, 5, 6],
  range: [0, 70, 100],
  tour: [[200, 180], [214, 170], [186, 188], null],
  mount,
});
