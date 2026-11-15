/**
 * Departure board: a split-flap board on a low plinth, six columns by four
 * rows of flaps hinged at their top edges. The pointer picks a column by
 * where it stands: its flaps swing out, and the columns beside it swing a
 * little, staggered from it. At rest one column hangs open, bright.
 */
const { Cam, fit, facing, poly, prism, proj, rings, seg, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const NC = 6, NR = 4, FW = 14, FH = 11, GX = 2, GZ = 2, BW = NC * (FW + GX) + 6, BZ = 12, BH = NR * (FH + GZ) + 8, D = 8, FAV = 2;
const restA = (k) => (k === FAV ? 1.0 : 0.12 + 0.08 * ((k * 3) % 4));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[0, -4, 0], [BW, D + 4, 0], [0, D + FH + 2, BZ], [BW, D + FH + 2, BZ], [0, 0, BZ + BH + 2], [BW, D, BZ + BH + 2]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-4, -4, BW + 4, D + 4, 3, 1.2);
  put(solid(g), prism(P, front, pr, pi, 0, 4));
  const [lr, li] = rings(BW / 2 - 6, 1, BW / 2 + 6, D - 1, 2, 1);
  put(solid(g), prism(P, front, lr, li, 4, BZ));
  const [br, bi] = rings(0, 0, BW, D, 2, 1);
  put(solid(g), prism(P, front, br, bi, BZ, BZ + BH));
  const cols = [];
  for (let k = 0; k < NC; k++) cols.push({ a: tween(restA(k)), flaps: [], last: NaN, x: 4 + k * (FW + GX) });
  for (let r = NR - 1; r >= 0; r--) for (const c of cols) c.flaps.push({ zt: BZ + 4 + (r + 1) * (FH + GZ), el: mk("path", { class: "sil" }, g), ln: mk("path", { class: "nf lo" }, g) });
  function draw(c, a) {
    if (a === c.last) return;
    c.last = a;
    const dy = FH * Math.sin(a), dz = FH * Math.cos(a);
    for (const f of c.flaps) {
      f.el.setAttribute("d", poly([P(c.x, D, f.zt), P(c.x + FW, D, f.zt), P(c.x + FW, D + dy, f.zt - dz), P(c.x, D + dy, f.zt - dz)]));
      f.ln.setAttribute("d", seg(P(c.x + 3, D + dy * 0.5, f.zt - dz * 0.5), P(c.x + FW - 3, D + dy * 0.5, f.zt - dz * 0.5)));
    }
  }
  const B = register(stage, (_dt, now) => {
    let m = false;
    for (const c of cols) { draw(c, tval(c.a, now)); if (!tdone(c.a, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);
  const mids = cols.map((c) => P(c.x + FW / 2, D, BZ + BH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    cols.forEach((c, k) => {
      const d = Math.abs(k - a), t = a < 0 ? restA(k) : d === 0 ? 1.35 : d === 1 ? 0.7 : 0.25;
      tset(c.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      for (const f of c.flaps) f.el.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "col " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "infodesk2",
  means: "A split-flap departure board: the column of flaps under the pointer swings out, and the columns beside it swing a little.",
  rules: [1, 2, 4, 5],
  range: [0, 45, 90],
  tour: [[246, 165], [138, 111], [275, 179], null],
  mount,
});
