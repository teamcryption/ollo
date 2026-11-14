/**
 * Wallet: a leather wallet standing on its edge with four cards in its
 * pockets. The pointer picks a card by where it stands: that card slides up
 * out of its pocket and its neighbours rise a little, staggered from it. At
 * rest the cards sit at uneven heights and one is bright. The slider is the stagger.
 */
const {
  Cam, fit, facing, prism, proj, rings, ringAt, open, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, W = 19, GAP = 22, X0 = 7, BH = 46, BY = 12, LIFT = 30, FAV = 2;
const REST = [9, 15, 12, 6];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.45);
  const XW = X0 * 2 + (N - 1) * GAP + W;
  fit(C, [[0, 0, 0], [XW, BY, 0], [XW, 0, BH + LIFT + 6], [0, BY, 0], [0, 0, BH + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const back = mk("g", {}, g);
  const [br, bi] = rings(0, 0, XW, BY / 2, 4, 1.2);
  put(solid(back), prism(P, front, br, bi, 0, BH));
  const cardsG = mk("g", {}, g);
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * GAP, grp = mk("g", {}, cardsG), s = solid(grp);
    const [cr, ci] = rings(x, BY / 2 - 1.2, x + W, BY / 2 + 0.8, 1, 0.5);
    items.push({ k, x, s, cr, ci, z: tween(REST[k]), last: NaN });
  }
  const frontG = mk("g", {}, g);
  const [fr, fi] = rings(0, BY / 2 + 1.2, XW, BY, 4, 1.2);
  put(solid(frontG), prism(P, front, fr, fi, 0, BH - 8));
  // the stitch and the fold of the front pocket
  mk("path", { class: "dash nf", d: open([P(3, BY, BH - 11), P(XW - 3, BY, BH - 11)]) }, frontG);
  mk("path", { class: "lo nf", d: seg(P(XW / 2, BY, 2), P(XW / 2, BY, BH - 13)) }, frontG);

  function draw(it, h) {
    if (h === it.last) return;
    it.last = h;
    put(it.s, prism(P, front, it.cr, it.ci, 8, BH + h));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + W / 2, BY / 2, BH));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 24 && sy > mids[best][1] - 80 && sy < mids[best][1] + 80 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), h = a < 0 ? REST[k] : d === 0 ? LIFT : d === 1 ? 14 : 6;
      tset(it.z, h, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "card " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "wallet",
  means: "A wallet on its edge with four cards: the card under the pointer slides up out of its pocket, its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[142, 116], [218, 154], [256, 173], null],
  mount,
});
