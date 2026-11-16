/**
 * Egg slicer: a cradle holding an egg, with a hinged frame of wires. The
 * pointer over it swings the frame down through the egg. At rest the frame
 * stands open, bright. The slider is how far it swings.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, rings, seg, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const L = 50, W = 18, HX = 2, HZ = 8, OPEN = 72;
const ell = (x, y, rx, ry, n = 32) => circ(1, n).map((q) => ({ ...q, u: x + q.u * rx, v: y + q.v * ry }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.62);
  const box = [[-4, -W - 4, 0], [L + 4, W + 4, 0], [L + 4, -W - 4, 0], [-4, W + 4, 0], [HX, 0, HZ + L], [HX + 16, -W, HZ + L]];
  fit(C, box, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -W - 4, L + 4, W + 4, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, 6));
  const egg = mk("g", {}, g), pts = [];
  for (let i = -6; i <= 6; i++) { const t = i / 6, s = Math.sqrt(1 - t * t); pts.push(...ringAt(P, ell(27, 0, 14 * s + 0.01, 10 * s + 0.01, 24), 15 + 10 * t)); }
  mk("path", { d: poly(hull(pts)) }, egg);
  const fr = mk("g", {}, g), frame = mk("path", { class: "nf hi" }, fr), wires = mk("path", { class: "nf lo" }, fr);

  const tw = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const a = (OPEN * (1 - v) + 2 * v) * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
    const at = (u, y) => P(HX + u * c, y, HZ + u * s);
    frame.setAttribute("d", poly([at(0, -W), at(L, -W), at(L, W), at(0, W)]) + poly([at(3, -W + 3), at(L - 3, -W + 3), at(L - 3, W - 3), at(3, W - 3)]));
    let d = "";
    for (let y = -12; y <= 12; y += 4) d += seg(at(3, y), at(L - 3, y));
    wires.setAttribute("d", d);
    if (a > 0.9) egg.before(fr); else egg.after(fr);
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const sp = box.map((p) => P(...p));
  const xs = sp.map((p) => p[0]), ys = sp.map((p) => p[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) - 8 && sx < Math.max(...xs) + 8 && sy > Math.min(...ys) - 8 && sy < Math.max(...ys) + 8;
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a ? reach : 0, performance.now(), 0);
    read.textContent = a ? "slice" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act) { tset(tw, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "eggslicer",
  means: "An egg slicer: the pointer swings the hinged frame of wires down through the egg in its cradle.",
  rules: [1, 3, 5, 6],
  range: [0.4, 1, 1],
  tour: [[200, 160], [210, 150], [190, 170], null],
  mount,
});
