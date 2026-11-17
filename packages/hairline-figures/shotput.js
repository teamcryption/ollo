/**
 * Shotput: a sprinter's starting block, a rail with three pedals hinged
 * along it. The pointer picks a pedal: it swings up steep, and its
 * neighbours rise a little, staggered from it. At rest the middle pedal
 * stands up, bright. The slider is the stagger.
 */
const { Cam, fit, proj, facing, hull, poly, rings, prism, put, solid, mk, register, tween, tset, tval, tdone, disposer, pointer, rad } = HL;
const box = (x0, y0, z0, x1, y1, z1) => { const o = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push([x, y, z]); return o; };
const N = 3, SP = 40, FAV = 1, REST = [22, 55, 30], ACT = [78, 40, 26], ZH = 5;

function shapes(cx) {
  const s = [{ pts: box(cx - 3, 4, 0, cx + 1, 32, 5) }, { pts: box(cx - 22, 6, 5, cx, 30, 7.5), hi: true }, { pts: [[cx - 22, 6, 7.5], [cx, 6, 7.5], [cx, 30, 7.5], [cx - 22, 30, 7.5]], face: 1 }];
  for (const d of [5, 10, 15]) s.push({ pts: [[cx - d, 8, 7.6], [cx - d, 28, 7.6]], face: 1 });
  return s;
}
const xf = (deg, hx) => { const c = Math.cos(rad(deg)), s = Math.sin(rad(deg)); return ([x, y, z]) => { if (z < 5) return [x, y, z]; const dx = x - hx, dz = z - ZH; return [hx + dx * c + dz * s, y, ZH - dx * s + dz * c]; }; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[0, -6, 0], [130, 32, 0], [0, -6, 28], [130, -6, 28], [130, 32, 6], [0, 32, 0]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(0, -6, 130, 4, 2, 1);
  put(solid(g), prism(P, front, cr, ci, 0, 5));
  const items = [];
  for (let k = 0; k < N; k++) {
    const cx = 42 + k * SP, grp = mk("g", {}, g);
    const sh = shapes(cx).map((s) => ({ ...s, el: mk("path", { class: s.face ? "nf lo" : "sil" }, grp) }));
    items.push({ k, cx, sh, v: tween(REST[k]), last: NaN });
  }
  const draw = (it, v) => {
    if (v === it.last) return;
    it.last = v;
    const T = xf(v, it.cx);
    for (const s of it.sh) { const q = s.pts.map((p) => P(...T(p))); s.el.setAttribute("d", poly(s.face ? q : hull(q))); }
  };
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.v, now)); if (!tdone(it.v, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);
  const mids = items.map((it) => P(...xf(REST[it.k], it.cx)([it.cx - 11, 18, 7])));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.hypot(m[0] - sx, m[1] - sy); if (d < bd) { bd = d; best = k; } });
    return bd < 60 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      tset(it.v, a < 0 ? REST[k] : ACT[Math.abs(k - a)], now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sh[1].el.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pedal " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "shotput",
  means: "A starting block with three pedals on its rail: the pedal under the pointer swings up steep, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[136, 148], [203, 182], [271, 216], null],
  mount,
});
