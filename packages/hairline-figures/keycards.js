/**
 * Keycards: four card readers standing on a ledge, each with a key card
 * resting in its top slot. The pointer picks a reader by where it stands:
 * its card slides up out of the slot, and the cards beside it rise a little,
 * staggered from it. At rest one card stands half out, bright. The slider is
 * the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, open, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 30, W = 10, D = 12, H = 34, CZ = 4, CARD = 9, LIFT = 30, FAV = 2;
const X1 = (N - 1) * STEP + 2 * W;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.2);
  const top = CZ + H;
  fit(C, [[-6, -6, 0], [X1 + 6, D + 6, 0], [X1 + 6, -6, 0], [-6, D + 6, 0], [W, D / 2, top + CARD + LIFT + 2], [X1 - W, D / 2, top + CARD + LIFT + 2]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-6, -6, X1 + 6, D + 6, 5, 2);
  put(solid(g), prism(P, front, br, bi, 0, CZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = W + k * STEP, grp = mk("g", {}, g);
    const [r, i] = rings(x - W, 0, x + W, D, 3, 1.4);
    put(solid(grp), prism(P, front, r, i, CZ, top));
    // the slot: a short dim groove across the top
    const [sr] = rings(x - 8, D / 2 - 0.9, x + 8, D / 2 + 0.9, 0.8, 0.3);
    mk("path", { d: open(ringAt(P, sr, top)) + "Z", class: "nf lo" }, grp);
    // the reader's lamp, low on the front face
    const lamp = mk("circle", { r: 1.6, class: "dot off" }, grp);
    const lp = P(x + 3, D, CZ + H * 0.35);
    lamp.setAttribute("cx", lp[0]); lamp.setAttribute("cy", lp[1]);
    const card = solid(grp);
    items.push({ k, x, card, lamp, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const [cr, ci] = rings(it.x - 7.5, D / 2 - 0.6, it.x + 7.5, D / 2 + 0.6, 0.6, 0.25);
    put(it.card, prism(P, front, cr, ci, top, top + CARD + lift));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, D / 2, CZ + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 28 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const on = a < 0 ? FAV : a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 9 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.card.sil.classList.toggle("hi", k === on);
      it.lamp.setAttribute("class", k === a ? "dot" : "dot off");
    });
    read.textContent = a < 0 ? "rest" : "rm " + (101 + a);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "keycards",
  means: "Four card readers on a ledge: the key card under the pointer slides up out of its slot, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[130, 95], [226, 143], [273, 166], null],
  mount,
});
