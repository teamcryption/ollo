/**
 * Console stack: four game consoles of different heights stacked on a low
 * stand. The pointer picks a console by its front face, and its disc tray
 * slides out of the face with a disc in its recess; the others close,
 * staggered from it. At rest one tray is half out, bright. The slider is
 * how far a tray slides.
 *
 * The pattern: one of a stack, sliding out (drawers).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, open, pointer, put, register, seg, solid,
} = HL;

const DECKS = [[10, 0], [6, 4], [9, 1], [6, 6]], W = 58, D = 50, BZ = 4, FAV = 2;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  let z = BZ;
  const decks = DECKS.map(([h, i]) => { const d = { h, i, z0: z, z1: z + h, fx: W - i }; z += h; return d; });
  fit(C, [[-8, -8, 0], [W + 40, D + 8, 0], [W + 40, -8, 0], [-8, D + 8, 0], [0, 0, z + 2], [W, D, z + 2]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-8, -8, W + 8, D + 8, 5, 2);
  put(solid(g), prism(P, front, sr, si, 0, BZ));

  decks.forEach((d, k) => {
    const [r, ri] = rings(d.i, d.i, d.fx, D - d.i, 3, 1.2);
    put(solid(g), prism(P, front, r, ri, d.z0, d.z1));
    const zm = d.z0 + d.h / 2;
    mk("path", { class: "nf lo", d: seg(P(d.fx, 12, zm), P(d.fx, 38, zm)) }, g);
    d.k = k;
    d.out = tween(k === FAV ? 14 : 0);
    d.last = NaN;
  });
  const trays = mk("g", {}, g);
  decks.forEach((d) => {
    d.grp = mk("g", {}, trays);
    d.tray = solid(d.grp);
    d.well = mk("path", { class: "nf lo" }, d.grp);
    d.cd = mk("path", { class: "nf" }, d.grp);
  });

  function draw(d, out) {
    if (out === d.last) return;
    d.last = out;
    if (out < 1.5) { for (const el of [d.tray.sil, d.tray.cr, d.well, d.cd]) el.setAttribute("d", ""); return; }
    const zm = d.z0 + d.h / 2, t0 = zm - 1.2, t1 = zm + 1.2, x0 = d.fx, x1 = d.fx + out;
    const [r, ri] = rings(x0, 12, x1, 38, 2, 0.8);
    put(d.tray, prism(P, front, r, ri, t0, t1));
    const cx = x1 - 14, cut = (pts) => pts.map((q) => ({ ...q, u: Math.max(q.u, d.fx + 0.5) }));
    d.well.setAttribute("d", poly(ringAt(P, cut(disc(cx, 25, 11.5)), t1)));
    const cd = cut(disc(cx, 25, 10.5));
    d.cd.setAttribute("d", poly(hull(ringAt(P, cd, t1 - 0.4).concat(ringAt(P, cd, t1 + 0.4)))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const d of decks) { draw(d, tval(d.out, now)); if (!tdone(d.out, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const faces = decks.map((d) => P(d.fx, 25, d.z0 + d.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    faces.forEach((f, k) => { const dd = Math.hypot(f[0] - sx, (f[1] - sy) * 1.6); if (dd < bd) { bd = dd; best = k; } });
    return bd < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    decks.forEach((d, k) => {
      const o = a < 0 ? (k === FAV ? 14 : 0) : k === a ? reach : 0;
      tset(d.out, o, now, from < 0 ? 0 : Math.abs(k - from) * 45);
      d.tray.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "deck " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; act = -2; }, destroy: bag.dispose };
}

hairline({
  name: "consolestack",
  means: "Four game consoles stacked on a stand: the one under the pointer slides its disc tray out, and the others close.",
  rules: [1, 2, 5, 6],
  range: [18, 30, 36],
  tour: [[221, 191], [220, 160], [211, 140], null],
  mount,
});
