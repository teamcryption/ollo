/**
 * Hockey sticks: five sticks hanging by their butts from hooks on a wall
 * rail, blades turned the same way, a puck on the floor beside them. The
 * pointer picks a stick by where it hangs: it swings out on its hook toward
 * the reader, and the sticks beside it sway a little, staggered from it. At
 * rest one stick hangs swung out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); each stick turns about
 * its hook, its shaft and blade the hull of their swung cross-sections.
 */
const {
  Cam, circ, facing, fit, hull, poly, prism, proj, rings, ringAt, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const LS = [70, 74, 67, 72, 65], REST = [0.05, 0.3, 0.02, 0.08, 0.04];
const STEP = 17, FAV = 1, OUT = 0.55, ZH = 84, Y0 = 5, BL = 14;
const X1 = (LS.length - 1) * STEP;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-16, -3, -3], [X1 + 18, 40, -3], [X1 + 18, -3, ZH + 14], [-16, 40, -3], [-16, -3, ZH + 14]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [ri, ii] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, ri, ii, z0, z1)); };
  box(-16, -3, X1 + 18, 40, 3, 1.4, -3, 0);
  box(-16, -3, X1 + 18, 0, 1.2, 0.5, 0, ZH + 14);
  box(-10, 0, X1 + 12, 3, 1, 0.5, ZH - 3, ZH + 3);
  LS.forEach((_l, k) => box(k * STEP - 1.4, 0, k * STEP + 1.4, Y0 + 1, 0.8, 0.4, ZH - 1.4, ZH + 1.4));

  const sticks = LS.map((L, k) => {
    const grp = mk("g", {}, g);
    return { k, L, x: k * STEP, grp, blade: solid(grp), shaft: solid(grp), a: tween(REST[k]), last: NaN };
  });
  // the puck, on the floor clear of every swing, behind any stick swung over it
  const pk = mk("g", {}, g);
  put(solid(pk), prism(P, front, disc(-8, 24, 4.5), disc(-8, 24, 3.6), 0, 2.4));

  function draw(s, a) {
    if (a === s.last) return;
    s.last = a;
    const sn = Math.sin(a), cs = Math.cos(a);
    const at = (d) => [Y0 + d * sn, ZH - d * cs];
    const ring = (x0, x1, d, h) => { const [y, z] = at(d); return ringAt(P, rrect(x0, y - h, x1, y + h, 0.8, 2), z); };
    s.shaft.sil.setAttribute("d", poly(hull(ring(s.x - 1.5, s.x + 1.5, -6, 1.5).concat(ring(s.x - 1.5, s.x + 1.5, s.L, 1.5)))));
    s.blade.sil.setAttribute("d", poly(hull(ring(s.x - 1.5, s.x + BL, s.L - 5, 0.9).concat(ring(s.x - 1, s.x + BL - 1, s.L, 0.9)))));
    const tape = (d) => { const [y, z] = at(d); return seg(P(s.x - 1.5, y + 1.5, z), P(s.x + 1.5, y + 1.5, z)); };
    s.shaft.cr.setAttribute("d", tape(4) + tape(9) + tape(s.L - 9));
  }

  let painted = "";
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const s of sticks) { draw(s, tval(s.a, now)); if (!tdone(s.a, now)) moving = true; }
    const order = sticks.slice().sort((p, q) => p.x + Math.sin(tval(p.a, now)) * 50 - (q.x + Math.sin(tval(q.a, now)) * 50));
    const key = order.map((s) => s.k).join();
    if (key !== painted) { painted = key; for (const s of order) g.appendChild(s.grp); }
    return moving;
  });
  bag.add(B.unregister);

  /** The stick whose resting middle is nearest the pointer's x on screen; -1 off the rack. */
  const mids = sticks.map((s) => P(s.x + 3, Y0, ZH - s.L / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 17 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    sticks.forEach((s, k) => {
      const d = Math.abs(k - a);
      const t = a < 0 ? REST[k] : d === 0 ? OUT : d === 1 ? 0.14 : 0.03;
      tset(s.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      s.shaft.sil.classList.toggle("hi", on); s.blade.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "stick " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "hockeysticks",
  means: "Five hockey sticks on a wall rack, a puck below: the stick under the pointer swings out on its hook, its neighbours sway.",
  rules: [1, 2, 5, 8],
  range: [0, 40, 80],
  tour: [[174, 134], [198, 146], [268, 177], null],
  mount,
});
