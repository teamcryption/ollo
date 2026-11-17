/**
 * Noodle press: a hopper on a base with a tall post behind it and a long
 * lever hinged on the post, its plunger hanging over the hopper, noodles
 * under the die. The pointer pulls the lever down: the further it stands
 * from the post, the deeper the plunger drives into the hopper. At rest the
 * hopper rim is bright. The slider is how far the lever may travel.
 */
const {
  Cam, circ, fit, hull, poly, open, proj, rings, ringAt, prism, facing, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HX = -16, HZ = 66, CX = 20, R = 11, Z0 = 24, Z1 = 50, UP = 0.5, DOWN = -0.12;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-24, -18, 0], [44, 18, 0], [70, 0, HZ + 72 * Math.sin(UP)], [-22, 0, HZ + 6], [74, 0, HZ - 10]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-24, -18, 44, 18, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, 3));
  const [pr, pi] = rings(HX - 4, -5, HX + 4, 5, 3, 1);
  put(solid(g), prism(P, front, pr, pi, 3, HZ + 3));
  const arm = solid(g);
  put(arm, prism(P, front, ...rings(HX, -3, CX - R + 1, 3, 2, 0.8), Z1 - 6, Z1 - 2));
  for (let i = -2; i <= 2; i++) for (let j = -1; j <= 1; j++) {
    const x = CX + i * 3.2, y = j * 3.4 + (i % 2) * 1.2;
    mk("path", { d: open([P(x, y, Z0), P(x + 0.6 * Math.sin(i + j), y, 12 + Math.abs(i + j) * 2)]), class: "lo nf" }, g);
  }
  const plunger = mk("path", { class: "sil" }, g), rod = mk("path", { class: "sil" }, g);
  const hop = solid(g);
  put(hop, prism(P, front, disc(CX, 0, R), disc(CX, 0, R - 1.6), Z0, Z1));
  const lever = mk("path", { class: "sil" }, g), grip = mk("path", { class: "sil" }, g);
  const cyl = (x0, x1, r0, r1, tf) => {
    const pts = [];
    for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; pts.push(tf(x0, r0 * Math.cos(t), r0 * Math.sin(t)), tf(x1, r1 * Math.cos(t), r1 * Math.sin(t))); }
    return poly(hull(pts));
  };
  const op = spring(UP);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a);
    const tf = (dx, y, dz) => P(HX + dx * c - dz * s, y, HZ + dx * s + dz * c);
    lever.setAttribute("d", cyl(-4, 70, 3, 2.4, tf));
    grip.setAttribute("d", cyl(56, 84, 4, 4, tf));
    const lz = HZ + (CX - HX) * Math.tan(a), dz = lz - 26;
    rod.setAttribute("d", poly(hull(ringAt(P, disc(CX, 0, 1.8, 12), dz).concat(ringAt(P, disc(CX, 0, 1.8, 12), lz)))));
    plunger.setAttribute("d", poly(hull(ringAt(P, disc(CX, 0, R - 2.4), dz - 3).concat(ringAt(P, disc(CX, 0, R - 2.4), dz)))));
    const inside = dz - 3 < Z1;
    if (inside) hop.g.before(plunger, rod); else hop.g.after(plunger, rod);
  }
  const B = register(stage, (dt) => { const m = stepS(op, dt); draw(op.x); return m; });
  bag.add(B.unregister);

  const mid = P(HX, 0, HZ - 20);
  let on = null;
  function aim(p) {
    const inside = p && Math.abs(p[0] - mid[0]) < 190 && Math.abs(p[1] - mid[1]) < 140;
    const o = inside ? clamp(Math.hypot(p[0] - mid[0], p[1] - mid[1]) / 110, 0.3, 1) * reach : 0;
    op.t = UP + (DOWN - UP) * o;
    const act = !!inside;
    if (act !== on) {
      on = act;
      hop.sil.classList.toggle("hi", !act);
      for (const el of [lever, grip]) el.classList.toggle("hi", act);
    }
    read.textContent = act ? Math.round(o * 100) + "%" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "noodlemaker",
  means: "A noodle press: the pointer pulls its long lever down and the plunger drives into the hopper over the noodles.",
  rules: [1, 3, 4, 5],
  range: [40, 80, 100],
  tour: [[262, 150], [150, 180], [300, 110], null],
  mount,
});
