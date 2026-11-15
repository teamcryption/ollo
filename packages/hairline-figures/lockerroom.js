/**
 * Locker bench: a row of tall lockers with a bench before them. The pointer
 * picks a locker by where it stands: its door swings open on its hinge, and
 * the doors beside it swing a little, staggered from it. At rest one door
 * stands ajar, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row, turned on a hinge.
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, fillet, seg, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, W = 28, D = 22, H = 78, FAV = 2, OPEN = 82, NEAR = 34, AJAR = 38;
const X1 = N * W, BY = D + 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[0, 0, H], [X1, 0, H], [0, BY + 10, 0], [X1, BY + 10, 0], [0, D + W, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, X1, D, 2, 1.2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const inner = mk("path", { class: "nf lo" }, g);
  let dIn = "";
  for (let k = 0; k < N; k++) {
    const x0 = k * W;
    dIn += seg(P(x0 + 3, D, H * 0.72), P(x0 + W - 3, D, H * 0.72)) + seg(P(x0 + W / 2, D, H * 0.66), P(x0 + W / 2, D, H * 0.6));
  }
  inner.setAttribute("d", dIn);

  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    const plate = mk("path", { class: "sil" }, grp), marks = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x0: k * W, plate, marks, a: tween(k === FAV ? AJAR : 0), last: NaN });
  }
  // the bench: two legs and a slatted top
  const bg = mk("g", {}, svg);
  for (const lx of [10, X1 - 16]) { const [lr, li] = rings(lx, BY + 1, lx + 6, BY + 9, 1, 0.8); put(solid(bg), prism(P, front, lr, li, 0, 16)); }
  const [tr, ti] = rings(4, BY, X1 - 4, BY + 10, 2, 1.2);
  put(solid(bg), prism(P, front, tr, ti, 16, 19.5));

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const a = rad(deg), w = W - 1.4, hx = it.x0 + 0.7, hy = D + 0.5;
    const at = (t, z) => P(hx + w * t * Math.cos(a), hy + w * t * Math.sin(a), z);
    it.plate.setAttribute("d", poly(fillet([at(0, 2), at(1, 2), at(1, H - 2), at(0, H - 2)], [1.5, 1.5, 1.5, 1.5])));
    let m = "";
    for (let v = 0; v < 3; v++) m += seg(at(0.25, H - 10 - v * 4), at(0.75, H - 10 - v * 4));
    m += seg(at(0.86, H * 0.5 - 5), at(0.86, H * 0.5 + 5));
    it.marks.setAttribute("d", m);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x0 + W / 2, D, H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 95 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), deg = a < 0 ? (k === FAV ? AJAR : 0) : dd === 0 ? OPEN : dd === 1 ? NEAR : 10;
      tset(it.a, deg, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.plate.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "locker " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "lockerroom",
  means: "Tall lockers behind a bench: the door under the pointer swings open on its hinge, and the doors beside it swing ajar.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[160, 135], [194, 152], [262, 186], null],
  mount,
});
