/**
 * Spiralizer: a base with a blade disc, a vegetable standing on it, and a
 * cap with a crank on top. The pointer over it turns the crank, and the cap
 * and vegetable sink onto the blade. At rest the crank stands, bright. The
 * slider is how far it turns.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const B0 = 30, VR = 11, VH = 44, ARM = 26;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.42);
  const box = [[-B0, -B0, 0], [B0, B0, 0], [B0, -B0, 0], [-B0, B0, 0], [0, 0, 8 + VH + 6 + 14], [ARM, 0, 8 + VH + 6 + 14], [0, ARM, 8 + VH + 20], [-ARM, 0, 70]];
  fit(C, box, 200, 160);
  const P = proj(C), front = facing(C);
  const cyl = (s, x, y, r, z0, z1, b = 1.5) => put(s, prism(P, front, disc(x, y, r), disc(x, y, r - b), z0, z1));
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-B0, -B0, B0, B0, 9, 2);
  put(solid(g), prism(P, front, br, bi, 0, 5));
  cyl(solid(g), 0, 0, 18, 5, 8, 2);
  const veg = solid(g), cap = solid(g), arm = mk("path", {}, g), knob = solid(g);
  arm.classList.add("sil", "hi");

  const tw = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const h = VH * (1 - 0.55 * v), zt = 8 + h, a = (20 + 300 * v) * Math.PI / 180;
    cyl(veg, 0, 0, VR, 8, zt, 1.2);
    cyl(cap, 0, 0, 14, zt, zt + 6, 2);
    const ex = ARM * Math.cos(a), ey = ARM * Math.sin(a), za = zt + 6;
    arm.setAttribute("d", poly(hull(ringAt(P, disc(0, 0, 3.5, 16), za).concat(ringAt(P, disc(ex, ey, 3.5, 16), za), ringAt(P, disc(0, 0, 3.5, 16), za + 3), ringAt(P, disc(ex, ey, 3.5, 16), za + 3)))));
    cyl(knob, ex, ey, 3.5, za + 3, za + 14, 1);
  }
  const L = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(L.unregister);

  const sp = box.map((p) => P(...p));
  const xs = sp.map((p) => p[0]), ys = sp.map((p) => p[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) - 8 && sx < Math.max(...xs) + 8 && sy > Math.min(...ys) - 8 && sy < Math.max(...ys) + 8;
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a ? reach : 0, performance.now(), 0);
    read.textContent = a ? "crank" : "rest";
    L.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act) { tset(tw, v, performance.now(), 0); L.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "spiralizer",
  means: "A spiralizer: the pointer turns the crank, and the cap presses the vegetable down onto the blade.",
  rules: [1, 3, 5, 6],
  range: [0.4, 1, 1],
  tour: [[200, 160], [210, 150], [190, 170], null],
  mount,
});
