/**
 * Speaker stack: three cabinets stacked on a low riser, the bottom one
 * widest, each with its cones on the front face. The pointer picks a
 * cabinet by height: it slides out toward the viewer and the cabinets beside
 * it slide a little, staggered from it. At rest the top cabinet stands a
 * little out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single column (riffle, stood up).
 */
const {
  Cam, fit, facing, open, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const CABS = [
  { w: 64, d: 30, h: 30, cones: [[16, 15, 10], [48, 15, 10]] },
  { w: 58, d: 28, h: 26, cones: [[15, 13, 8], [43, 13, 8]] },
  { w: 50, d: 26, h: 22, cones: [[25, 11, 8]] },
];
const OUT = 14, FAV = 2, RZ = 5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-6, -6, 0], [70, -6, 0], [-6, 36 + OUT, 0], [70, 36 + OUT, 0], [0, 0, RZ + 78], [64, 30 + OUT, RZ + 78]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [rr, ri] = rings(-6, -6, 70, 36, 3, 1.5);
  put(solid(g), prism(P, front, rr, ri, 0, RZ));

  let z = RZ;
  const items = CABS.map((c, k) => {
    const x0 = (64 - c.w) / 2, grp = mk("g", {}, g), s = solid(grp), cp = mk("path", { class: "nf lo" }, grp);
    const it = { ...c, k, x0, z0: z, grp, s, cp, o: tween(k === FAV ? OUT * 0.5 : 0), last: NaN };
    z += c.h;
    return it;
  });

  function draw(it, o) {
    if (o === it.last) return;
    it.last = o;
    const y0 = (30 - it.d) / 2 + o, y1 = y0 + it.d, [r, i] = rings(it.x0, y0, it.x0 + it.w, y1, 3, 1.4);
    put(it.s, prism(P, front, r, i, it.z0, it.z0 + it.h));
    // cones on the front face, each a ring and its dust cap
    let d = "";
    for (const [cx, cz, R] of it.cones) {
      for (const rad of [R, R * 0.62, R * 0.2]) {
        const pts = [];
        for (let t = 0; t < 28; t++) { const a = (t / 28) * Math.PI * 2; pts.push(P(it.x0 + cx + rad * Math.cos(a), y1, it.z0 + cz + rad * Math.sin(a))); }
        d += poly(pts);
      }
    }
    it.cp.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.o, now)); if (!tdone(it.o, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x0 + it.w / 2, 30, it.z0 + it.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][0] - sx) < 110 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), o = a < 0 ? (k === FAV ? OUT * 0.5 : 0) : dd === 0 ? OUT : dd === 1 ? 4 : 0;
      tset(it.o, o, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "cab " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "ampstack",
  means: "A stack of three speaker cabinets: the one under the pointer slides out, the ones beside it a little, staggered.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[186, 103], [186, 154], [186, 213], null],
  mount,
});
