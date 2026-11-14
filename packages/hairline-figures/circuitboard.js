/**
 * Circuit board: a rounded board with copper traces on its top and a row of
 * four chips seated in their footprints. The pointer picks a chip by where it
 * is along the board: that chip lifts out of its footprint, its neighbours
 * rise a little after it, staggered by distance. At rest the chips sit at
 * uneven heights, one half-seated, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row; the hit is on a fixed plane
 * through the chips' resting tops.
 */
const { Cam, clamp, facing, fit, open, poly, prism, proj, rings, ringAt, rrect, seg, unproj, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const N = 4, BX = 74, BY = 46, BT = 3, CW = 12, CY0 = 12, CY1 = 32, CH = 4, LIFT = 16, BUMP = 4;
const XS = [6, 23, 40, 57], REST = [0, 1.5, 4, 0.5], FAV = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[0, 0, 0], [BX, BY, 0], [BX, 0, 0], [0, BY, 0], [XS[0], CY0, BT + CH + LIFT], [XS[3] + CW, CY0, BT + CH + LIFT]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [bo, bi] = rings(0, 0, BX, BY, 5, 1.4);
  const board = solid(g);
  put(board, prism(P, front, bo, bi, 0, BT));
  // the traces and the chips' footprints, printed on the board's top
  let tr = "";
  XS.forEach((x, k) => {
    tr += poly(ringAt(P, rrect(x - 1, CY0 - 1, x + CW + 1, CY1 + 1, 1, 3), BT));
    tr += open([P(x + CW / 2, CY1 + 1, BT), P(x + CW / 2, BY - 6, BT), P(x + CW / 2 + 4, BY - 3, BT)]);
    tr += open([P(x + 3, CY0 - 1, BT), P(x + 3, 6, BT), P(x + 7, 3, BT)]);
    if (k < N - 1) tr += seg(P(x + CW + 1, 22, BT), P(XS[k + 1] - 1, 22, BT));
  });
  mk("path", { class: "nf lo", d: tr }, board.g);

  const chips = XS.map((x, k) => {
    const s = solid(g), pins = mk("path", { class: "nf lo" }, s.g);
    return { k, x, s, pins, z: tween(REST[k]), last: NaN };
  });
  function draw(c, lift) {
    if (lift === c.last) return;
    c.last = lift;
    const z0 = BT + lift, [r, i] = rings(c.x, CY0, c.x + CW, CY1, 1.6, 0.8);
    put(c.s, prism(P, front, r, i, z0, z0 + CH));
    let d = "";
    for (let j = 0; j < 4; j++) { const y = CY0 + 3 + j * 4.6; d += seg(P(c.x + CW, y, z0 + 1), P(c.x + CW + 1.5, y, z0 - 0.5)); }
    c.pins.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    chips.forEach((c) => { draw(c, tval(c.z, now)); if (!tdone(c.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, BT + CH);
    if (x < -3 || x > BX + 3 || y < -3 || y > BY + 3) return -1;
    return clamp(Math.round((x - XS[0] - CW / 2) / (XS[1] - XS[0])), 0, N - 1);
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    chips.forEach((c, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : Math.max(0, BUMP - 2 * Math.abs(k - a));
      tset(c.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      c.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "U" + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "circuitboard",
  means: "A circuit board: the chip under the pointer lifts out of its footprint, its neighbours rise a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[144, 140], [184, 160], [263, 200], null],
  mount,
});
