/**
 * Roof box: a car with two crossbars on its roof and a long luggage box
 * clamped to them. The pointer picks a bag inside by where it stands: the
 * lid lifts and that bag rises out of the box, the bags beside it rise a
 * little, staggered from it. At rest the lid stands ajar and one bag peeks
 * out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, BZ = 46, BT = 53, LID = 6, FAV = 1;
const BX = [27, 50, 73];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-2, -2, -4], [102, 46, -4], [102, -2, -4], [-2, 46, -4], [14, 8, BT + LID + 26], [86, 36, BT + LID + 26]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const nearY = P(50, 0, 0)[1] > P(50, 44, 0)[1] ? -0.6 : 44.6;
  const wheel = (x) => { const pts = []; for (let i = 0; i < 32; i++) { const a = (i / 32) * 2 * Math.PI; pts.push(P(x + 9 * Math.cos(a), nearY, 5 + 9 * Math.sin(a))); } return pts; };
  const [br, bi] = rings(0, 0, 100, 44, 8, 2);
  put(solid(g), prism(P, front, br, bi, 2, 24));
  for (const x of [22, 78]) { mk("path", { d: poly(wheel(x)) }, g); }
  const [cr, ci] = rings(20, 4, 80, 40, 9, 2);
  put(solid(g), prism(P, front, cr, ci, 24, 40));
  for (const x of [32, 68]) { const [xr, xi] = rings(x - 1.5, 1, x + 1.5, 43, 0.6, 0.5); put(solid(g), prism(P, front, xr, xi, 40, 42.5)); }
  const [sr, si] = rings(12, 8, 88, 36, 12, 2);
  put(solid(g), prism(P, front, sr, si, 42.5, BT));

  const items = BX.map((x, k) => {
    const s = solid(g);
    return { k, x, s, z: tween(k === FAV ? 7 : 0), last: NaN };
  });
  const lid = solid(g);
  const lz = tween(LID);
  let lastLid = NaN;

  function draw(now) {
    for (const it of items) {
      const h = tval(it.z, now);
      if (h === it.last) continue;
      it.last = h;
      if (h < 0.4) { put(it.s, { sil: "", crease: "" }); continue; }
      const [r, i] = rings(it.x - 8, 12, it.x + 8, 32, 3, 1.2);
      put(it.s, prism(P, front, r, i, BT, BT + h));
    }
    const l = tval(lz, now);
    if (l !== lastLid) { lastLid = l; put(lid, prism(P, front, sr, si, BT + l, BT + l + 6)); }
  }

  const B = register(stage, (_dt, now) => {
    draw(now);
    return !tdone(lz, now) || items.some((it) => !tdone(it.z, now));
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 22, BT));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    tset(lz, a < 0 ? LID : 24, now, 0);
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? 7 : 0) : dd === 0 ? 16 : 7;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bag " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "roofbox",
  means: "A luggage box on a car's roof bars: the lid lifts and the bag under the pointer rises out, its neighbours rising a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[236, 152], [164, 116], [200, 134], null],
  mount,
});
