/**
 * Wallet cards: an open leather wallet, one half lying flat with an ID
 * window, the other leaning back with five cards in staggered pockets, each
 * pocket lower and nearer than the one above it. The pointer picks a card by
 * where it is on the leaning half: that card slides up out of its pocket,
 * and the cards beside it rise a little, staggered from it. At rest one card
 * stands half out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the hit is on the
 * leaning half's resting plane, which never moves.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, poly, prism, proj, rings, rrect, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 62, H = 42, AL = (72 * Math.PI) / 180, N = 5, FAV = 2, OUT = 18;
const PK = [33, 27, 21, 15, 9], CX = [8, 11, 7, 12, 9], CW = 42, REST = [2, 0, 7, 1, 3], NEAR = [OUT, 6, 2];
const ca = Math.cos(AL), sa = Math.sin(AL);
const Q = (x, v, d) => [x, -v * ca + d * sa, 2 + v * sa + d * ca];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[0, 2, 0], [W, 2, 0], [W, 42, 0], [0, 42, 0], Q(0, PK[0] + 5 + OUT, 0), Q(W, H, 0), Q(CX[0] + CW, PK[0] + 5 + OUT, 0)], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const plate = (x0, v0, x1, v1, r, d0, d1) => {
    const pts = fillet([[x0, v0], [x1, v0], [x1, v1], [x0, v1]], [r, r, r, r], 4);
    return { sil: poly(hull(pts.map(([x, v]) => P(...Q(x, v, d0))).concat(pts.map(([x, v]) => P(...Q(x, v, d1)))))), face: pts.map(([x, v]) => P(...Q(x, v, d1))) };
  };

  // the leaning half: a leather plate with a stitch line inside its edge
  const back = plate(0, 0, W, H, 5, -3, 0);
  mk("path", { class: "sil", d: back.sil }, g);
  mk("path", { class: "nf lo", d: poly(plate(2.5, 2.5, W - 2.5, H - 2.5, 3.5, 0, 0).face) }, g);

  const cards = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    const sil = mk("path", { class: "sil" }, grp), cr = mk("path", { class: "nf lo" }, grp);
    const d = 0.5 + k * 1.1;
    mk("path", { d: plate(3, 1, W - 3, PK[k], 2, d + 0.6, d + 1.1).sil }, g);
    cards.push({ k, d, sil, cr, lift: tween(REST[k]), last: NaN });
  }

  // the flat half, in front: a leather plate with an ID window
  const [fr, fi] = rings(0, 3, W, 42, 5, 1.4);
  put(solid(g), prism(P, front, fr, fi, 0, 3));
  mk("path", { class: "nf lo", d: poly(ringAt(P, rrect(10, 12, W - 10, 34, 3, 6), 3)) }, g);

  function draw(c, lift) {
    if (lift === c.last) return;
    c.last = lift;
    const x0 = CX[c.k], top = PK[c.k] + 5 + lift;
    c.sil.setAttribute("d", plate(x0, PK[c.k] - 16, x0 + CW, top, 2.2, c.d, c.d + 0.5).sil);
    const chip = fillet([[x0 + 5, top - 13], [x0 + 12, top - 13], [x0 + 12, top - 8], [x0 + 5, top - 8]], [1, 1, 1, 1], 3);
    c.cr.setAttribute("d", poly(chip.map(([x, v]) => P(...Q(x, v, c.d + 0.5)))) + `M${P(...Q(x0 + 3, top - 3, c.d + 0.5))}L${P(...Q(x0 + CW - 3, top - 3, c.d + 0.5))}`);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const c of cards) { draw(c, tval(c.lift, now)); if (!tdone(c.lift, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // the hit: the pointer on the leaning half's resting plane, nearest pocket band
  const o = P(...Q(0, 0, 0)), ex = P(...Q(1, 0, 0)), ev = P(...Q(0, 1, 0));
  const a1 = ex[0] - o[0], b1 = ev[0] - o[0], a2 = ex[1] - o[1], b2 = ev[1] - o[1], det = a1 * b2 - b1 * a2;
  function hit([sx, sy]) {
    const u = sx - o[0], w = sy - o[1], x = (u * b2 - b1 * w) / det, v = (a1 * w - u * a2) / det;
    if (x < -4 || x > W + 4 || v < 2 || v > PK[0] + 5 + OUT) return -1;
    return clamp(Math.round((PK[0] + 2.5 - v) / 6), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    cards.forEach((c, k) => {
      tset(c.lift, a < 0 ? REST[k] : NEAR[Math.abs(k - a)] ?? 0, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      c.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
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
  name: "walletcards",
  means: "An open wallet with five cards in staggered pockets: the card under the pointer slides up, its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[279, 145], [233, 170], [182, 176], null],
  mount,
});
