/**
 * Mould tray: a casting tray with a grid of cavities, a cast part in each.
 * The pointer picks a cavity on the tray's top: its part is ejected up out
 * of the mould, and the parts round it rise less the further they sit,
 * staggered from it. At rest a low swell of parts stands up near one
 * corner, the tallest bright. The slider is the stagger.
 *
 * The pattern: a field over a plane (terrain).
 */
const {
  Cam, clamp, fit, facing, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NX = 4, NY = 3, PIT = 24, M = 6, HP = 8, TZ = 9, PH = 6, LIFT = 20;
const W = NX * PIT + 2 * M, D = NY * PIT + 2 * M, FAV = [1, 1];
const fall = (d) => (d < 0.5 ? 1 : d < 1.2 ? 0.45 : d < 1.6 ? 0.22 : 0.06);
const restLift = (i, j) => LIFT * 0.8 * Math.exp(-((i - FAV[0]) ** 2 + (j - FAV[1]) ** 2) / 1.6) + 3 * Math.exp(-((i - 3) ** 2 + (j - 2) ** 2) / 1.2);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, 0, TZ + PH + LIFT], [W, D, TZ + PH + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(0, 0, W, D, 7, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));

  const cells = [];
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) cells.push({ i, j });
  cells.sort((a, b) => a.i + a.j - (b.i + b.j));
  const pg = mk("g", {}, g);
  for (const c of cells) {
    const x = M + c.i * PIT + PIT / 2, y = M + c.j * PIT + PIT / 2;
    const [cr] = rings(x - HP - 1.5, y - HP - 1.5, x + HP + 1.5, y + HP + 1.5, 4, 1);
    mk("path", { d: poly(ringAt(P, cr, TZ)), class: "nf lo" }, g.insertBefore(mk("g", {}), pg));
  }
  for (const c of cells) {
    const x = M + c.i * PIT + PIT / 2, y = M + c.j * PIT + PIT / 2;
    const [r, inner] = rings(x - HP, y - HP, x + HP, y + HP, 4, 1.4);
    Object.assign(c, { x, y, r, inner, s: solid(pg), z: tween(restLift(c.i, c.j)), last: NaN });
  }

  function draw(c, lift) {
    if (lift === c.last) return;
    c.last = lift;
    put(c.s, prism(P, front, c.r, c.inner, TZ - 2 + lift, TZ - 2 + PH + lift));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const c of cells) { draw(c, tval(c.z, now)); if (!tdone(c.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TZ);
    const i = Math.floor((x - M) / PIT), j = Math.floor((y - M) / PIT);
    return i >= 0 && i < NX && j >= 0 && j < NY ? [i, j] : null;
  }

  let key = "init";
  function setActive(a) {
    const k = a ? a.join() : "rest";
    if (k === key) return;
    key = k;
    const now = performance.now(), src = a || FAV;
    for (const c of cells) {
      const d = Math.hypot(c.i - src[0], c.j - src[1]);
      tset(c.z, a ? LIFT * fall(d) + 2 : restLift(c.i, c.j), now, d * stag);
      c.s.sil.classList.toggle("hi", c.i === src[0] && c.j === src[1]);
    }
    read.textContent = a ? "cav " + (a[0] + 1) + "·" + (a[1] + 1) : "rest";
    B.wake();
  }
  setActive(null);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = clamp(v, 0, 90); }, destroy: bag.dispose };
}

hairline({
  name: "moldtray",
  means: "A casting tray of cavities: the part under the pointer is ejected out of its mould, and the parts round it rise less.",
  rules: [1, 2, 3, 5],
  range: [0, 45, 90],
  tour: [[183, 138], [217, 190], [217, 225], null],
  mount,
});
