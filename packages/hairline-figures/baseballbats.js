/**
 * Baseball bats: five bats standing barrel down in a floor rack, knobs up.
 * The pointer picks a bat by where it stands along the row: it slides up out
 * of the rack, and the bats beside it lift a little, staggered from it. At
 * rest one bat stands half drawn, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 16, LIFT = 26, FAV = 3, BL = 62;
const X1 = (N - 1) * STEP + 20;
const REST = [2, 0, 5, 14, 3];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-4, -10, 0], [X1 + 4, 10, 0], [X1 + 4, -10, 0], [-4, 10, 0], [10, 0, BL + LIFT + 6], [X1 - 10, 0, BL + LIFT + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -10, X1 + 4, 10, 5, 1.5);
  put(solid(g), prism(P, front, br, bi, 0, 4));
  
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 10 + k * STEP, grp = mk("g", {}, g);

    mk("path", { d: poly(ringAt(P, disc(x, 0, 4.6, 28), 4)), class: "nf lo" }, grp);
    const bat = mk("path", { class: "sil" }, grp), tape = mk("path", { class: "nf lo" }, grp), knob = mk("path", { class: "nf" }, grp);
    items.push({ k, x, bat, tape, knob, z: tween(REST[k]), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const x = it.x, z0 = 4 + lift;
    const body = [...ringAt(P, disc(x, 0, 3.6), z0), ...ringAt(P, disc(x, 0, 3.6), z0 + 24), ...ringAt(P, disc(x, 0, 2.6), z0 + 38), ...ringAt(P, disc(x, 0, 1.5), z0 + BL - 4)];
    it.bat.setAttribute("d", poly(hull(body)));
    it.tape.setAttribute("d", poly(ringAt(P, disc(x, 0, 1.7), z0 + BL - 14)));
    it.knob.setAttribute("d", poly(hull(ringAt(P, disc(x, 0, 2.7, 16), z0 + BL - 3.5).concat(ringAt(P, disc(x, 0, 2.7, 16), z0 + BL - 1.5)))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, 30));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 16 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? LIFT : dd === 1 ? 6 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.bat.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bat " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "baseballbats",
  means: "Five bats standing in a floor rack: the bat under the pointer slides up out of the rack, its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[150, 150], [200, 170], [250, 190], null],
  mount,
});
