/**
 * Effects rack: six units of different heights stacked between two rack
 * rails, each with a pair of knob dots and a handle on its face. The pointer
 * picks a unit by its height on screen: it slides out toward the reader like
 * a drawer, and the units beside it ease out a little, staggered from it. At
 * rest one unit is half out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single stack; the pick is the unit whose
 * resting face is nearest the pointer's y on screen.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const UH = [10, 14, 8, 12, 10, 14], W = 70, D = 40, OUT = 24, FAV = 3, GAP = 1;
const zs = []; { let z = 4; for (const h of UH) { zs.push(z); z += h + GAP; } }
const ZT = zs[zs.length - 1] + UH[UH.length - 1] + 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-6, 0, 0], [W + 6, D + OUT, 0], [W + 6, 0, 0], [-6, D + OUT, 0], [-6, 0, ZT], [W + 6, 0, ZT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1, el = solid(g)) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(el, prism(P, front, o, i, z0, z1)); return el; };

  // the foot, the back panel and the far rail
  block(-6, -2, W + 6, D + 2, 2, 1, 0, 4);
  block(-6, -2, W + 6, 1, 1.2, 0.5, 4, ZT);
  block(-6, 1, -1, D + 2, 1.2, 0.5, 4, ZT);
  const units = UH.map((h, k) => {
    const el = solid(g), marks = mk("path", { class: "nf lo" }, el.g);
    const dots = [mk("circle", { class: "dot off", r: 1.6 }, el.g), mk("circle", { class: "dot off", r: 1.6 }, el.g)];
    return { k, h, z0: zs[k], el, marks, dots, y: tween(k === FAV ? 12 : 0), last: "" };
  });
  const rail = block(W + 1, 1, W + 6, D + 2, 1.2, 0.5, 4, ZT);

  function draw(u, y) {
    const key = y.toFixed(2);
    if (key === u.last) return;
    u.last = key;
    const [r, i] = rings(1, y, W - 1, y + D, 1.4, 0.8);
    put(u.el, prism(P, front, r, i, u.z0, u.z0 + u.h));
    const zm = u.z0 + u.h / 2, f = y + D;
    u.marks.setAttribute("d", seg(P(W * 0.55, f, zm), P(W * 0.85, f, zm)) + seg(P(W * 0.55, f, zm - 2), P(W * 0.55, f, zm + 2)) + seg(P(W * 0.85, f, zm - 2), P(W * 0.85, f, zm + 2)));
    u.dots.forEach((d, j) => { const [sx, sy] = P(8 + j * 9, f, zm); d.setAttribute("cx", sx); d.setAttribute("cy", sy); });
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const u of units) { draw(u, tval(u.y, now)); if (!tdone(u.y, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** The unit whose resting face middle is nearest the pointer's y on screen; -1 off the rack. */
  const mids = units.map((u) => P(W / 2, D, u.z0 + u.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[1] - sy); if (d < bd) { bd = d; best = k; } });
    return bd < 16 && Math.abs(mids[best][0] - sx) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    units.forEach((u, k) => {
      const d = Math.abs(k - a);
      const y = a < 0 ? (k === FAV ? 12 : 0) : d === 0 ? OUT : d === 1 ? 7 : d === 2 ? 2 : 0;
      tset(u.y, y, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      u.el.sil.classList.toggle("hi", on);
      u.dots.forEach((d) => d.setAttribute("class", on ? "dot" : "dot off"));
    });
    read.textContent = a < 0 ? "rest" : "unit " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "rackunit",
  means: "Six effects units in a rack: the one under the pointer slides out like a drawer, its neighbours easing out in turn.",
  rules: [1, 2, 5, 8],
  range: [0, 40, 80],
  tour: [[189, 171], [189, 210], [189, 125], null],
  mount,
});
