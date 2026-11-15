/**
 * Slatwall hooks: a slatted wall panel with three hooks, a boxed package
 * hanging on each. The pointer picks a hook by where it is along the wall:
 * that package slides out along its hook, its neighbours a little after it.
 * At rest the packages sit unevenly, the middle one pulled out, bright.
 */
const { Cam, clamp, fit, hull, poly, proj, seg, tdone, tset, tval, tween, disposer, mk, pointer, register, solid } = HL;

const N = 3, WX = 66, WZ = 60, PW = 16, PH = 24, PD = 6, HZ = 44, REST = [3, 9, 1], FAV = 1, OUT = 20;
const XS = [5, 25, 45];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.6);
  fit(C, [[0, 0, 0], [WX, 0, 0], [0, 0, WZ], [WX, 0, WZ], [0, OUT + PD + 4, HZ - PH], [WX, OUT + PD + 4, HZ]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const wall = solid(g);
  wall.sil.setAttribute("d", poly([P(0, -3, 0), P(WX, -3, 0), P(WX, 0, 0), P(WX, 0, WZ), P(0, 0, WZ), P(0, -3, WZ)]));
  let d = "";
  for (let z = 8; z < WZ; z += 9) d += seg(P(1, 0, z), P(WX - 1, 0, z));
  wall.cr.setAttribute("d", d + seg(P(0, 0, 0), P(0, 0, WZ)) + seg(P(0, 0, WZ), P(0, -3, WZ)));
  wall.cr.setAttribute("class", "nf lo");
  const items = XS.map((x, k) => {
    const s = solid(g);
    s.cr.setAttribute("class", "nf lo");
    return { k, x, s, y: tween(REST[k]), last: NaN };
  });
  function draw(it, y) {
    if (y === it.last) return;
    it.last = y;
    const x0 = it.x, x1 = it.x + PW, xm = it.x + PW / 2, z1 = HZ - 2, z0 = z1 - PH;
    const pts = [];
    for (const [x, yy, z] of [[x0, y, z0], [x1, y, z0], [x0, y + PD, z0], [x1, y + PD, z0], [x0, y, z1], [x1, y, z1], [x0, y + PD, z1], [x1, y + PD, z1]]) pts.push(P(x, yy, z));
    it.s.sil.setAttribute("d", poly(hull(pts)));
    it.s.cr.setAttribute("d", seg(P(x0, y + PD, z1), P(x1, y + PD, z1)) + seg(P(x1, y + PD, z0), P(x1, y + PD, z1)) +
      seg(P(xm, y + PD, HZ), P(xm, OUT + PD + 3, HZ)) + seg(P(xm, OUT + PD + 3, HZ), P(xm, OUT + PD + 3, HZ + 3)) +
      poly([P(xm - 2, y + PD, z1 - 2), P(xm + 2, y + PD, z1 - 2), P(xm + 2, y + PD, z1 - 5), P(xm - 2, y + PD, z1 - 5)]));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    items.forEach((it) => { draw(it, tval(it.y, now)); if (!tdone(it.y, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: one row, the package whose rest centre is nearest the pointer's screen x
  const cx = items.map((it) => P(it.x + PW / 2, REST[it.k], HZ - PH / 2)[0]);
  function hit([sx, sy]) {
    if (sy < 20 || sy > 300) return -1;
    let k = -1, best = 1e9;
    cx.forEach((c, i) => { const dd = Math.abs(sx - c); if (dd < best) { best = dd; k = i; } });
    return best < 45 ? k : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      tset(it.y, a < 0 ? REST[k] : k === a ? OUT : clamp(6 - 3 * Math.abs(k - a), 0, 6), now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "hook " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "slatwall",
  means: "Slatwall hooks: the package on the hook under the pointer slides out along it, its neighbours a little after.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[177, 102], [205, 115], [235, 130], null],
  mount,
});
