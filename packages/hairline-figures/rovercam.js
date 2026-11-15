/**
 * Rover mast: a six-wheeled rover with a tall mast and a wide camera head.
 * The pointer is what the rover should look at: the head pans on the mast to
 * face the point on the ground, on a spring. At rest it looks off to the left.
 */
const {
  Cam, circ, fit, facing, hull, poly, open, prism, proj, rings, rrect, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const MZ = 62, HW = 22, HD = 9, HH = 15, WR = 9, WX = [-30, 0, 30];
const REST = 1.15;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-42, -30, 0], [42, 30, 0], [42, -30, 0], [-42, 30, 0], [0, 0, MZ + HH + 2], [-HW, -HW, MZ + HH], [HW, HW, MZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => {
    const ring = (yy) => circ(WR, 28).map((q) => P(x + q.u, yy, WR + q.v));
    const s = solid(g);
    s.sil.setAttribute("d", poly(hull(ring(y - 3).concat(ring(y + 3)))));
    s.cr.setAttribute("d", poly(circ(WR - 4, 20).map((q) => P(x + q.u, y + 3.2, WR + q.v))));
    s.cr.setAttribute("class", "nf lo");
  };
  WX.forEach((x) => wheel(x, -24));
  const [dr, di] = rings(-38, -18, 38, 18, 6, 1.6);
  put(solid(g), prism(P, front, dr, di, 12, 24));
  WX.forEach((x) => wheel(x, 24));
  put(solid(g), prism(P, front, circ(4, 20), circ(3, 20), 24, MZ));
  const head = solid(g), lens = mk("path", { class: "nf" }, g), eye = mk("path", { class: "nf" }, g);
  const yaw = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = "", over = false;

  function draw() {
    const key = yaw.x.toFixed(3);
    if (key === last) return; last = key;
    const a = yaw.x, ca = Math.cos(a), sa = Math.sin(a);
    const rot = (u, v) => [u * ca - v * sa, u * sa + v * ca];
    const at = (ring, z) => ring.map((q) => { const [x, y] = rot(q.u, q.v); return P(x, y, z); });
    const foot = rrect(-HD, -HW, HD, HW, 4, 4), inner = rrect(-HD + 1.5, -HW + 1.5, HD - 1.5, HW - 1.5, 2.5, 4);
    head.sil.setAttribute("d", poly(hull(at(foot, MZ).concat(at(foot, MZ + HH)))));
    head.cr.setAttribute("d", poly(at(inner, MZ + HH)));
    head.cr.setAttribute("class", "nf lo");
    const show = ca + sa > -0.2;
    const lensAt = (off, r) => circ(r, 24).map((q) => { const [x, y] = rot(HD + 0.3, off + q.u); return P(x, y, MZ + HH / 2 + q.v); });
    lens.setAttribute("d", show ? poly(lensAt(-10, 4.6)) : "");
    eye.setAttribute("d", show ? poly(lensAt(9, 3)) : "");
  }

  const B = register(stage, (dt) => { const m = stepS(yaw, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(p) {
    if (p) {
      let a = Math.atan2(p[1], p[0]);
      while (a - yaw.t > Math.PI) a -= 2 * Math.PI; while (a - yaw.t < -Math.PI) a += 2 * Math.PI;
      yaw.t = a;
    } else yaw.t = REST;
    over = !!p;
    head.sil.classList.toggle("hi", over);
    lens.setAttribute("class", over ? "nf" : "nf hi");
    read.textContent = over ? `pan ${((Math.round(yaw.t * 57.3) % 360) + 360) % 360}°` : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); aim(Math.hypot(x, y) > 110 ? null : [x, y]); },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { yaw.k = 100 * v; yaw.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "rovercam",
  means: "A six-wheeled rover's mast camera: the head pans on the mast to look at the point under the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[269, 270], [48, 228], [365, 221], null],
  mount,
});
