/**
 * Swim lanes: a pool with four lanes split by float ropes, a starting block
 * at the head of each lane. The pointer picks a lane by where it stands on
 * the water or its block: that block rises, the blocks beside it rise a
 * little, staggered from it. At rest one block stands raised, bright.
 * The slider is the stagger.
 */
const {
  Cam, fit, facing, open, prism, proj, rings, ringAt, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, W = 26, L = 150, DZ = 6, WZ = 3.5, BH = 8, LIFT = 26, FAV = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.62);
  fit(C, [[-22, -8, 0], [L + 8, N * W + 8, 0], [L + 8, -8, 0], [-22, N * W + 8, 0], [-12, 0, DZ + BH + LIFT + 2], [-12, N * W, DZ + BH + LIFT + 2]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dr, di] = rings(-22, -8, L + 8, N * W + 8, 6, 2);
  put(solid(g), prism(P, front, dr, di, 0, DZ));
  // the water: the basin's inner edge, a little below the deck
  const [wr] = rings(0, 0, L, N * W, 3, 1);
  mk("path", { d: "M" + ringAt(P, wr, WZ).map((p) => p.join(",")).join("L") + "Z", class: "nf lo" }, g);
  // float ropes between lanes, and the black line down each lane's floor
  for (let k = 1; k < N; k++) mk("path", { d: open([P(2, k * W, WZ + 0.6), P(L - 2, k * W, WZ + 0.6)]), class: "nf dash" }, g);
  for (let k = 0; k < N; k++) mk("path", { d: open([P(14, k * W + W / 2, WZ), P(L - 14, k * W + W / 2, WZ)]), class: "nf lo" }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const y = k * W + W / 2, grp = mk("g", {}, g);
    const s = solid(grp);
    items.push({ k, y, s, z: tween(k === FAV ? LIFT * 0.7 : k === 0 ? 3 : 0), last: NaN });
  }
  function draw(it, h) {
    if (h === it.last) return;
    it.last = h;
    const [r, i] = rings(-18, it.y - 9, -3, it.y + 9, 2.5, 1.4);
    put(it.s, prism(P, front, r, i, DZ, DZ + BH + h));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, WZ);
    if (x > -4 && x < L + 4 && y > 0 && y < N * W) return Math.floor(y / W);
    const [bx, by] = unproj(C, sx, sy, DZ + BH);
    if (bx > -20 && bx < 2 && by > 0 && by < N * W) return Math.floor(by / W);
    return -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : k === 0 ? 3 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "lane " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "swimlanes",
  means: "A pool of four lanes with a starting block at each head: the lane under the pointer raises its block, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[193, 192], [262, 158], [56, 148], null],
  mount,
});
