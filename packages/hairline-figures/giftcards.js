/**
 * Card rack: a low shop display tray with a row of gift cards standing in
 * it, each with a hang tab punched with a hole. The pointer picks a card by
 * where it is along the rack: that card rises out high, its neighbours rise
 * after it, less the farther they stand. At rest the cards sit unevenly, one
 * pulled up a little, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row; the hit is on a fixed plane
 * through the cards' resting faces.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rrect, ringAt, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, STEP = 9, XS0 = 7, TOP = 8, Y0 = -2, Y1 = 34, SW = 1.6, VIS = 16, LIFT = 28;
const X1 = XS0 + (N - 1) * STEP + 7;
const REST = [2, 0, 7, 1, 3, 0], FAV = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.75);
  fit(C, [[0, Y0, 0], [X1, Y1, 0], [X1, Y0, 0], [0, Y1, 0], [XS0, 6, TOP + VIS + LIFT + 6], [X1, 28, TOP + VIS + LIFT + 6]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the tray: one rounded solid with its well along the top
  const tray = solid(g);
  put(tray, prism(P, front, rrect(0, Y0, X1, Y1, 6, 10), rrect(1, Y0 + 1, X1 - 1, Y1 - 1, 5, 10), 0, TOP));
  mk("path", { class: "nf lo", d: poly(ringAt(P, rrect(3, 3, X1 - 3, 29, 3, 6), TOP)) }, tray.g);

  const cards = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    cards.push({ k, x: XS0 + k * STEP, sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp), z: tween(REST[k]), last: NaN });
  }

  // a card: a rounded plate in the y–z plane with a hang tab on top, given a thickness along x
  function profile(x, h) {
    const zt = TOP + h, zb = zt - 6;
    const pts = [[5, TOP - 2], [27, TOP - 2], [27, zb], [21, zb], [19, zt], [13, zt], [11, zb], [5, zb]];
    return fillet(pts, [0, 0, 2, 1.5, 2, 2, 1.5, 2], 4).map(([y, z]) => [x, y, z]);
  }
  function hole(x, h) {
    const pts = [], zc = TOP + h - 2.6;
    for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; pts.push(P(x, 16 + 1.6 * Math.cos(a), zc + 1.1 * Math.sin(a))); }
    return poly(pts);
  }
  function draw(s, lift) {
    if (lift === s.last) return;
    s.last = lift;
    const h = VIS + lift, near = profile(s.x + SW / 2, h), far = profile(s.x - SW / 2, h);
    s.sil.setAttribute("d", poly(hull(near.concat(far).map((p) => P(...p)))));
    s.cr.setAttribute("d", open(near.filter((p) => p[2] > TOP + 0.5).map((p) => P(...p))) + hole(s.x + SW / 2, h));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    cards.forEach((s) => { draw(s, tval(s.z, now)); if (!tdone(s.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: the pointer on a fixed plane through the resting cards, nearest card along x
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TOP + VIS * 0.6);
    if (x < -3 || x > X1 + 3 || y < Y0 - 4 || y > Y1 + 2) return -1;
    return clamp(Math.round((x - XS0) / STEP), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    cards.forEach((s, k) => {
      const d = Math.abs(k - (a < 0 ? 0 : a));
      const z = a < 0 ? REST[k] : k === a ? LIFT : clamp(LIFT * 0.6 - 5 * d, 3, LIFT);
      tset(s.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
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
  name: "giftcards",
  means: "A shop rack of gift cards: the card under the pointer rises out high, its neighbours rise after it.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[140, 164], [188, 188], [260, 224], null],
  mount,
});
