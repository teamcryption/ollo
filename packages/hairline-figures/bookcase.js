/**
 * Wall shelves: three floating shelves set at staggered heights on a wall,
 * each holding a book block and a vase. The pointer picks a shelf by its rest
 * top: what stands on it lifts off, and the shelves beside it stir a little,
 * staggered from it. At rest the middle shelf is bright, its things raised.
 * The slider is the stagger.
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const SH = [[0, 74, 14], [50, 128, 46], [14, 92, 78]], D = 20, T = 3, LIFT = 14, FAV = 2;
const ITEMS = [[["b", 8, 16, 18], ["c", 54, 6, 13]], [["c", 64, 5, 10], ["b", 92, 22, 9]], [["b", 26, 10, 14], ["c", 70, 7, 16]]];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.55);
  fit(C, [[-6, -4, 0], [134, -4, 0], [134, D, 0], [-6, 0, 104], [134, 0, 104], [70, 10, 78 + T + 16 + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [wr, wi] = rings(-6, -4, 134, 0, 2, 0.8);
  put(solid(g), prism(P, front, wr, wi, 0, 104));

  const shelves = SH.map(([x0, x1, z], k) => {
    const grp = mk("g", {}, g), plate = solid(grp);
    const [r, i] = rings(x0, 0, x1, D, 3, 1.4);
    put(plate, prism(P, front, r, i, z, z + T));
    const its = ITEMS[k].map(([t, x, w, h]) => {
      const [ring, inner] = t === "b" ? rings(x, 4, x + w, 15, 1.5, 1) : [disc(x, 10, w), disc(x, 10, w - 1.5)];
      return { s: solid(grp), ring, inner, h, z0: z + T };
    });
    return { k, x0, x1, z, plate, its, lift: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN };
  });

  function draw(sh, lift) {
    if (lift === sh.last) return;
    sh.last = lift;
    for (const it of sh.its) put(it.s, prism(P, front, it.ring, it.inner, it.z0 + lift, it.z0 + lift + it.h));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const sh of shelves) { draw(sh, tval(sh.lift, now)); if (!tdone(sh.lift, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    for (const sh of shelves) {
      const [wx, wy] = unproj(C, sx, sy, sh.z + T);
      if (wx < sh.x0 - 4 || wx > sh.x1 + 4 || wy < -24 || wy > D + 6) continue;
      const dd = Math.abs(wy - D / 2);
      if (dd < bd) { bd = dd; best = sh.k; }
    }
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    for (const sh of shelves) {
      const dd = Math.abs(sh.k - a), z = a < 0 ? (sh.k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 3 : 0;
      tset(sh.lift, z, now, from < 0 ? 0 : Math.abs(sh.k - from) * stag);
      sh.plate.sil.classList.toggle("hi", sh.k === (a < 0 ? FAV : a));
    }
    read.textContent = a < 0 ? "rest" : "shelf " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "bookcase",
  means: "Three floating shelves on a wall: what stands on the shelf under the pointer lifts, and the shelves beside it stir.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[150, 194], [215, 184], [172, 119], null],
  mount,
});
