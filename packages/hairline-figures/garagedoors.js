/**
 * Garage doors: a block of three garages under one roof slab, on an apron,
 * each opening fitted with a slatted roll-up door under its drum housing. The
 * pointer picks a garage by where it stands: its door rolls up, and the doors
 * beside it roll up partly, staggered from it. At rest one door stands half
 * up, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (bookshelf); the pick is the door
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, DW = 26, GAP = 9, H = 30, DH = 22, D = 34, FAV = 2, REST = [0.08, 0, 0.45];
const W = GAP + N * (DW + GAP);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[0, 0, 0], [W, 0, H + 4], [0, D + 22, -3], [W, D + 22, -3], [0, 0, H + 4], [W + 2, D + 3, H + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const onFace = (y) => (q) => P(q.u, y, q.v);
  const g = mk("g", {}, svg);

  const [ar, ai] = rings(-4, D - 6, W + 4, D + 22, 3, 1.4);
  put(solid(g), prism(P, front, ar, ai, -3, 0));
  const [br, bi] = rings(0, 0, W, D, 2, 1);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const [rr, ri] = rings(-2, -2, W + 2, D + 3, 2, 1);
  put(solid(g), prism(P, front, rr, ri, H, H + 4));

  const doors = [];
  for (let k = 0; k < N; k++) {
    const x0 = GAP + k * (DW + GAP), x1 = x0 + DW;
    // the opening, its back wall line, and the drum housing above it
    mk("path", { d: poly(rrect(x0, 0, x1, DH, 0.8, 2).map(onFace(D))), class: "nf lo" }, g);
    mk("path", { d: seg(P(x0 + 1, D - 0.2, DH - 1), P(x0 + 1, D - 0.2, 1)) + seg(P(x0 + 1, D - 0.2, 1), P(x1 - 1, D - 0.2, 1)), class: "nf lo" }, g);
    const [hr, hi] = rings(x0 - 1, D, x1 + 1, D + 3, 1.2, 0.6);
    const door = mk("path", { class: "sil" }, g), slats = mk("path", { class: "nf lo" }, g);
    put(solid(g), prism(P, front, hr, hi, DH, DH + 4));
    doors.push({ k, x0, x1, door, slats, s: tween(REST[k]), last: NaN });
  }

  function draw(d, s) {
    const zb = s * (DH - 1.5), y = D - 0.6;
    d.door.setAttribute("d", poly(rrect(d.x0 + 0.6, zb, d.x1 - 0.6, DH, 0.6, 2).map(onFace(y))));
    let sl = "";
    for (let z = DH - 2.6; z > zb + 0.8; z -= 2.6) sl += seg(P(d.x0 + 1.4, y, z), P(d.x1 - 1.4, y, z));
    sl += seg(P(d.x0 + DW / 2 - 2, y, zb + 1), P(d.x0 + DW / 2 + 2, y, zb + 1));
    d.slats.setAttribute("d", sl);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const d of doors) {
      const s = tval(d.s, now);
      if (s !== d.last) { draw(d, s); d.last = s; }
      if (!tdone(d.s, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  /** The door whose resting middle is nearest the pointer's x on screen; -1 off the block. */
  const mids = doors.map((d) => P((d.x0 + d.x1) / 2, D, DH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    doors.forEach((d, k) => {
      const dist = Math.abs(k - a);
      const s = a < 0 ? REST[k] : dist === 0 ? 0.82 : dist === 1 ? 0.3 : 0.1;
      tset(d.s, s, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      d.door.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : `garage ${a + 1}`;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "garagedoors",
  means: "A row of three garages: the door under the pointer rolls up, and the doors beside it roll up partly.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[136, 152], [205, 186], [273, 220], null],
  mount,
});
