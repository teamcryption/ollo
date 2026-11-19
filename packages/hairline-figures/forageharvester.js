/**
 * Forage harvester: a self-propelled chopper with a wide header in front
 * and a long discharge spout on its back. The pointer over the machine
 * swings the spout round from trailing behind to blowing out to the side.
 * At rest the spout trails back, bright. The slider is how far it swings.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, rings, tdone, tset, tval, tween, clamp, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TX = 56, TY = 18, TZ = 40, ARM = 62, REST = 0.1;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[0, -16, 0], [116, 52, 0], [116, -16, 16], [-10, 18, 80], [80, 86, 80], [72, 86, 50], [96, 6, 64]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 4, b = 1.4) => {
    const [a, i] = rings(x0, y0, x1, y1, r, b);
    put(solid(g), prism(P, front, a, i, z0, z1));
  };
  box(14, 2, 98, 34, 6, 12, 3, 1.2);
  box(12, 0, 96, 36, 12, TZ, 6, 1.8);
  box(72, 6, 96, 30, TZ, 62, 5, 1.6);
  box(100, -16, 116, 52, 3, 16, 3, 1.4);
  for (let k = 1; k < 6; k++) { const y = -16 + k * 68 / 6; mk("path", { d: "M" + P(116, y, 5).join(" ") + "L" + P(116, y, 14).join(" "), class: "lo" }, g); }
  const sg = mk("g", {}, g);
  const tube = (a, b, r) => {
    const pts = [];
    for (const q of [a, b]) for (const dz of [-r, 0, r]) pts.push(...ringAt(P, disc(q[0], q[1], r * (dz ? 0.7 : 1)), q[2] + dz));
    return poly(hull(pts));
  };
  let last = NaN;
  function draw(p) {
    const key = p * 7 + reach;
    if (key === last) return;
    last = key;
    const th = rad(180 - 105 * reach * clamp(p, 0, 1)), c = Math.cos(th), s = Math.sin(th);
    const top = [TX, TY, TZ + 22], end = [TX + ARM * c, TY + ARM * s, TZ + 34], tip = [TX + (ARM + 6) * c, TY + (ARM + 6) * s, TZ + 24];
    const parts = [
      { d: tube([TX, TY, TZ + 2], top, 5), k: TX + TY, cls: "" },
      { d: tube(top, end, 5.2), k: (top[0] + end[0] + top[1] + end[1]) / 2, cls: "sil hi" },
      { d: tube(end, tip, 5.6), k: end[0] + end[1] + 1, cls: "" },
    ].sort((u, v) => u.k - v.k);
    sg.replaceChildren();
    for (const q of parts) mk("path", { d: q.d, class: q.cls }, sg);
  }
  const tw = tween(REST);
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const hb = hull([[0, -16, 0], [116, -16, 0], [116, 52, 0], [0, 52, 0], [12, 0, 62], [96, 36, 62]].map((q) => P(...q)));
  const xs = hb.map((q) => q[0]), ys = hb.map((q) => q[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) && sy < Math.max(...ys);
  let on = null;
  function setOn(o) {
    if (o === on) return;
    on = o;
    tset(tw, o ? 1 : REST, performance.now(), 0);
    read.textContent = o ? "swing" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inside(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "forageharvester",
  means: "A forage harvester: the pointer swings its long spout round from trailing behind to blowing out to the side.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[180, 150], [217, 230], [149, 156], null],
  mount,
});
