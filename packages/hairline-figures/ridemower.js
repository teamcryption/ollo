/**
 * Ride-on mower: a low tractor body with a hood, seat, steering wheel and a
 * wide cutting deck slung between the wheels, and a grass catcher hung at
 * the back. Over the mower the catcher swings up on its top hinge to tip
 * out on the 700ms ease; leaving lowers it shut, the catcher bright. The
 * slider is how far it tips.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rrect, clamp, lerp, rad, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HX = -28, HZ = 38;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tip = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-60, -15, 0], [34, 15, 0], [34, -15, 0], [-60, 15, 0], [-62, 15, 66], [-28, -15, 70]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (par, x0, y0, x1, y1, z0, z1, r = 2, b = 1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(par); put(s, prism(P, front, o, i, z0, z1)); return s; };
  const catcher = mk("path", { class: "sil hi" }, g), slats = mk("path", { class: "nf lo" }, g);
  const wheel = (cx, y, dy, r) => {
    const ring = (yy, rr) => Array.from({ length: 22 }, (_, i) => { const t = (i / 22) * Math.PI * 2; return P(cx + rr * Math.cos(t), yy, r + rr * Math.sin(t)); });
    mk("path", { d: poly(hull(ring(y, r).concat(ring(y + dy, r)))), class: "sil" }, g);
    mk("path", { d: poly(ring(y + (dy > 0 ? dy : 0), r * 0.4)), class: "nf lo" }, g);
  };
  wheel(-18, -16, 4, 9); wheel(22, -14, 3, 5);
  for (const y of [-11, 8]) box(g, -30, y, -27, y + 3, 8, 40, 0.8, 0.4);
  box(g, -31, -12, -26, 12, 38, 41, 1.2, 0.5);
  box(g, -10, -17, 16, 17, 3, 7, 8, 2);
  box(g, -26, -11, 30, 11, 8, 14, 4, 1.4);
  box(g, 8, -10, 30, 10, 14, 25, 5, 1.6);
  box(g, -17, -8, -4, 8, 14, 19, 3, 1.2);
  box(g, -19, -8, -15, 8, 19, 32, 2, 0.8);
  box(g, 2, -1, 4, 1, 14, 30, 0.8, 0.4);
  mk("path", { d: poly(Array.from({ length: 20 }, (_, i) => { const t = (i / 20) * Math.PI * 2; return P(3 + 6 * Math.cos(t), 6 * Math.sin(t), 31); })), class: "nf" }, g);
  wheel(-18, 12, 4, 9); wheel(22, 11, 3, 5);
  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const f = rad(-lerp(0, tip, t)), c = Math.cos(f), s = Math.sin(f);
    const T = (x, y, z) => { const dx = x - HX, dz = z - HZ; return P(HX + dx * c - dz * s, y, HZ + dx * s + dz * c); };
    const pts = [];
    for (const z of [6, 38]) for (const q of rrect(-56, -15, -28, 15, 4, 3)) pts.push(T(q.u, q.v, z));
    catcher.setAttribute("d", poly(hull(pts)));
    let d = "";
    for (const z of [16, 27]) d += "M" + T(-56, 15, z).join(",") + "L" + T(-28, 15, z).join(",");
    slats.setAttribute("d", d);
  }
  const B = register(stage, (dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  function move([sx, sy]) {
    if (Math.abs(sx - 200) > 140 || sy < 15 || sy > 305) return leave();
    tset(tw, 1, performance.now(), 0);
    read.textContent = "tip " + Math.round(tip);
    B.wake();
  }
  function leave() { tset(tw, 0, performance.now(), 0); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tip = clamp(v, 45, 95); last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "ridemower",
  means: "A ride-on mower: over it the grass catcher at the back swings up on its hinge to tip out; the slider sets how far.",
  rules: [3, 5, 8],
  range: [45, 75, 95],
  tour: [[149, 122], [215, 160], [180, 215], null],
  mount,
});
