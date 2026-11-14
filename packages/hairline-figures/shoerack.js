/**
 * Boot tray: a low rimmed mudroom tray with four wellies standing on it,
 * each a tall rounded shaft over a toe that runs forward. The pointer picks
 * a boot by where it is along the row: that boot is lifted off the tray, its
 * neighbours hop a little after it. At rest the boots stand out of line,
 * tall and short, one bright.
 *
 * The pattern: one of many in a single row; the hit is the nearest boot's
 * rest centre by screen x.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 14, W = 10, TRAY = 2.5, LIFT = 15, BUMP = 3;
const H = [30, 22, 30, 24], DY = [0, 3, -1, 2], FAV = 1;
const X1 = (N - 1) * STEP + W + 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.45);
  fit(C, [[-4, -5, 0], [X1, 28, 0], [X1, -5, 0], [-4, 28, 0], [0, 0, 30 + LIFT + TRAY], [X1, 0, 30 + LIFT + TRAY]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the tray: a thin plate with a rim, a second line for its lip
  const tray = solid(g);
  const [tr, ti] = rings(-4, -5, X1, 28, 4, 1.6);
  put(tray, prism(P, front, tr, ti, 0, TRAY));

  const boots = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    boots.push({ k, x: k * STEP, y: DY[k], h: H[k], shaft: solid(grp), toe: solid(grp), z: tween(0), last: NaN });
  }

  function draw(b, lift) {
    if (lift === b.last) return;
    b.last = lift;
    const z0 = TRAY + lift;
    const [sr, si] = rings(b.x, b.y, b.x + W, b.y + 10, 4.5, 1.2);
    put(b.shaft, prism(P, front, sr, si, z0, z0 + b.h));
    const [tr2, ti2] = rings(b.x + 0.4, b.y + 4, b.x + W - 0.4, b.y + 22, 4.8, 1.2);
    put(b.toe, prism(P, front, tr2, ti2, z0, z0 + 6));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    boots.forEach((b) => { draw(b, tval(b.z, now)); if (!tdone(b.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: on the tray, then the boot whose rest centre is nearest in screen x
  const cx = boots.map((b) => P(b.x + W / 2, b.y + 8, TRAY + 10)[0]);
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TRAY);
    if (x < -10 || x > X1 + 6 || y < -30 || y > 30) return -1;
    let best = 0;
    cx.forEach((c, k) => { if (Math.abs(c - sx) < Math.abs(cx[best] - sx)) best = k; });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    boots.forEach((b) => {
      const z = a < 0 ? 0 : b.k === a ? LIFT : clamp(BUMP - 1.5 * Math.abs(b.k - a), 0, BUMP);
      tset(b.z, z, now, from < 0 ? 0 : Math.abs(b.k - from) * stag);
      const on = b.k === (a < 0 ? FAV : a);
      b.shaft.sil.classList.toggle("hi", on); b.toe.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "boot " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "shoerack",
  means: "A boot tray of wellies: the boot under the pointer is lifted off the tray, its neighbours hop a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[170, 162], [221, 204], [267, 215], null],
  mount,
});
