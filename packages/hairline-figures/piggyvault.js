/**
 * Coin dispenser: four coin tubes standing on a dispenser base, each holding
 * a stack of a different height. The pointer picks a tube by where it
 * stands: its top coin springs up out of the stack, and the tubes beside it
 * nudge theirs up a little, staggered from it. At rest one coin is raised,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, prism, proj, ringAt, open, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, rings,
} = HL;

const N = 4, STEP = 30, R = 11, BZ = 8, CH = 3, LIFT = 24, FAV = 1;
const H = [9, 6, 11, 7];
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  const X1 = 2 * R + 8 + (N - 1) * STEP;
  const top = BZ + 11 * CH + LIFT + CH;
  fit(C, [[0, 0, 0], [X1, 30, 0], [X1, 0, 0], [0, 30, 0], [R + 4, 15, top], [X1 - R - 4, 15, top]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, X1, 30, 7, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + 4 + k * STEP, y = 15, h = BZ + H[k] * CH;
    const grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, R), disc(x, y, R - 1.5), BZ, h));
    // the coin edges down the stack
    let d = "";
    for (let c = 1; c < H[k]; c++) d += open(ringAt(P, disc(x, y, R).filter(front), BZ + c * CH));
    mk("path", { class: "nf lo", d }, grp);
    const coin = solid(grp);
    items.push({ k, x, y, h, coin, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    put(it.coin, prism(P, front, disc(it.x, it.y, R), disc(it.x, it.y, R - 2.5), it.h + lift, it.h + lift + CH));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, it.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.coin.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tube " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "piggyvault",
  means: "Four coin tubes on a dispenser: the top coin of the tube under the pointer springs up off its stack, and its neighbours nudge up.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[127, 129], [224, 178], [273, 202], null],
  mount,
});
