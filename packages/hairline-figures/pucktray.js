/**
 * Pucktray: three hockey pucks on a slab of ice. The pointer picks a puck:
 * it slides out toward the viewer, spinning as it goes, and its neighbours
 * slide a little, staggered from it. At rest the middle puck sits out,
 * bright. The slider is the stagger.
 */
const { Cam, fit, proj, facing, hull, poly, rings, prism, put, solid, mk, register, tween, tset, tval, tdone, disposer, pointer, rad } = HL;
const ring = (x, y, r, z, n = 32) => Array.from({ length: n }, (_, i) => { const a = (i / n) * 2 * Math.PI; return [x + r * Math.cos(a), y + r * Math.sin(a), z]; });
const N = 3, SP = 35, R = 13, FAV = 1, REST = [4, 20, 8], ACT = [34, 10, 3], Y0 = 15, Z0 = 3, Z1 = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-4, -4, 0], [104, 64, 0], [104, 64, 10], [-4, -4, 10], [104, -4, 0], [-4, 64, 0]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-4, -4, 104, 34, 5, 1.5);
  put(solid(g), prism(P, front, cr, ci, 0, Z0));
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 15 + k * SP, grp = mk("g", {}, g);
    const el = mk("path", { class: "sil" }, grp), groove = mk("path", { class: "nf lo" }, grp), top = mk("path", { class: "nf lo" }, grp), mark = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, el, groove, top, mark, v: tween(REST[k]), last: NaN });
  }
  const draw = (it, s) => {
    if (s === it.last) return;
    it.last = s;
    const y = Y0 + s, pr = (pts) => pts.map((p) => P(...p));
    it.el.setAttribute("d", poly(hull(pr(ring(it.x, y, R, Z0).concat(ring(it.x, y, R, Z1))))));
    it.groove.setAttribute("d", poly(pr(ring(it.x, y, R, (Z0 + Z1) / 2).filter((p) => p[0] - p[1] > it.x - y - 4))));
    it.top.setAttribute("d", poly(pr(ring(it.x, y, R - 3, Z1))));
    const a = rad(s * 6), c = Math.cos(a) * (R - 3), d = Math.sin(a) * (R - 3);
    it.mark.setAttribute("d", poly(pr([[it.x - c, y - d, Z1], [it.x + c, y + d, Z1]])));
  };
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.v, now)); if (!tdone(it.v, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);
  const mids = items.map((it) => P(it.x, Y0 + REST[it.k], Z1));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.hypot(m[0] - sx, m[1] - sy); if (d < bd) { bd = d; best = k; } });
    return bd < 55 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      tset(it.v, a < 0 ? REST[k] : ACT[Math.abs(k - a)], now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.el.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "puck " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "pucktray",
  means: "Three hockey pucks on ice: the puck under the pointer slides out, spinning, and its neighbours slide a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[156, 114], [216, 148], [277, 182], null],
  mount,
});
