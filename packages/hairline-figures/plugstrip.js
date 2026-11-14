/**
 * Power strip: a long strip with four sockets in a row, a plug seated in
 * each, a switch at the end. The pointer picks a socket by where it stands:
 * that plug pulls out of its socket, prongs showing, and the plugs beside it
 * ease up a little, staggered from it. At rest one plug is half out, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 30, SZ = 9, PW = 9, PH = 14, LIFT = 26, FAV = 1, X0 = 22;
const REST = [0, 12, 2, 0];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.2);
  const X1 = X0 + (N - 1) * STEP + 34;
  fit(C, [[0, 0, 0], [X1, 28, 0], [X1, 0, 0], [0, 28, 0], [X0, 14, SZ + LIFT + PH + 6], [X1 - 30, 14, SZ + LIFT + PH + 6]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(0, 0, X1, 28, 8, 2);
  put(solid(g), prism(P, front, sr, si, 0, SZ));
  // the switch at the far end of the row
  const [wr, wi] = rings(X1 - 22, 7, X1 - 8, 21, 3, 1);
  const sw = solid(g);
  put(sw, prism(P, front, wr, wi, SZ, SZ + 3));
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, y = 14;
    // the socket: two slots in the strip's top
    const slots = mk("path", { class: "nf lo", d: seg(P(x - 3, y - 3, SZ), P(x - 3, y + 3, SZ)) + seg(P(x + 3, y - 3, SZ), P(x + 3, y + 3, SZ)) }, g);
    const grp = mk("g", {}, g);
    const prongs = mk("path", { class: "nf" }, grp);
    const body = solid(grp), nub = solid(grp);
    items.push({ k, x, y, slots, prongs, body, nub, z: tween(REST[k]), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const { x, y } = it, b = SZ + lift;
    it.prongs.setAttribute("d", seg(P(x - 3, y, SZ), P(x - 3, y, b + 1)) + seg(P(x + 3, y, SZ), P(x + 3, y, b + 1)));
    const [br, bi] = rings(x - PW, y - PW, x + PW, y + PW, 4, 1.6);
    put(it.body, prism(P, front, br, bi, b, b + PH));
    const [nr, ni] = rings(x - 4, y - 4, x + 4, y + 4, 4, 1);
    put(it.nub, prism(P, front, nr, ni, b + PH, b + PH + 5));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, SZ + PH / 2));
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
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "socket " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "plugstrip",
  means: "A power strip with four plugs: the plug under the pointer pulls out of its socket, prongs showing, and its neighbours ease up.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[121, 154], [214, 200], [261, 224], null],
  mount,
});
