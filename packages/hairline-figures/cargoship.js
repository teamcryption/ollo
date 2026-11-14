/**
 * Cargo ship: a rounded hull with the bridge at the stern and four bays of
 * stacked containers along the deck. The pointer picks a bay by where it is
 * along the ship: that bay's top container is hoisted clear, the bays beside
 * it lift a little, staggered from it. At rest one box hangs just off its
 * stack, bright, as if mid-load. The slider is the stagger.
 *
 * The pattern: one of many in a single row; the hit is the nearest bay's
 * rest centre along the screen x.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, L = 104, W = 30, HZ = 12, BX = 24, BS = 19, BW = 16, CH = 6, LIFT = 18;
const LAYERS = [3, 2, 4, 2], REST = [0, 0, 3, 0], FAV = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[0, 0, 0], [L, W, 0], [L, 0, 0], [0, W, 0], [BX + 2 * BS, 4, HZ + 5 * CH + LIFT], [6, 4, HZ + 22]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the hull: a long rounded solid, the bow rounder than the stern, with a deck line
  const hull = solid(g);
  const [hr, hi] = rings(0, 0, L, W, 13, 1.8);
  put(hull, prism(P, front, hr, hi, 0, HZ));
  mk("path", { class: "nf lo", d: seg(P(4, W, 4), P(L - 12, W, 4)) }, hull.g);
  // the bridge at the stern
  const br = solid(g);
  const [rr, ri] = rings(4, 6, 16, W - 6, 2, 0.8);
  put(br, prism(P, front, rr, ri, HZ, HZ + 22));
  mk("path", { class: "nf lo", d: seg(P(16, 9, HZ + 18), P(16, W - 9, HZ + 18)) }, br.g);

  // the bays: a fixed stack and one top container that hoists
  const bays = [];
  for (let k = 0; k < N; k++) {
    const x = BX + k * BS, top = HZ + (LAYERS[k] - 1) * CH;
    const stack = solid(g);
    const [r, i] = rings(x, 4, x + BW, W - 4, 1.4, 0.6);
    put(stack, prism(P, front, r, i, HZ, top));
    let d = "";
    for (let l = 1; l < LAYERS[k] - 1; l++) d += seg(P(x + 1, W - 4, HZ + l * CH), P(x + BW - 1, W - 4, HZ + l * CH));
    mk("path", { class: "nf lo", d }, stack.g);
    const box = solid(g);
    const ribs = mk("path", { class: "nf lo" }, box.g);
    bays.push({ x, top, r, i, box, ribs, z: tween(REST[k]), last: NaN });
  }
  function draw(b, lift) {
    if (lift === b.last) return;
    b.last = lift;
    const z0 = b.top + lift;
    put(b.box, prism(P, front, b.r, b.i, z0, z0 + CH));
    let d = "";
    for (let u = 4; u < BW; u += 4) d += seg(P(b.x + u, W - 4, z0 + 1), P(b.x + u, W - 4, z0 + CH - 1));
    b.ribs.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    bays.forEach((b) => { draw(b, tval(b.z, now)); if (!tdone(b.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: inside the hull's footprint, then the bay whose rest centre is nearest on screen x
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, HZ);
    if (x < 0 || x > L + 4 || y < -8 || y > W + 4) return -1;
    let best = -1, bd = Infinity;
    bays.forEach((b, k) => { const d = Math.abs(P(b.x + BW / 2, W / 2, b.top)[0] - sx); if (d < bd) { bd = d; best = k; } });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    bays.forEach((b, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : clamp(5 - 2.5 * Math.abs(k - a), 0, 5);
      tset(b.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      b.box.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bay " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "cargoship",
  means: "A cargo ship with four bays of containers: the top box of the bay under the pointer is hoisted clear, its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[163, 128], [231, 156], [265, 178], null],
  mount,
});
