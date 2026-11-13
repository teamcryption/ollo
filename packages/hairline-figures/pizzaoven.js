/**
 * Pizza oven: a dome oven on a long plinth, an arched entrance vault in front
 * of the dome, a chimney behind, and a peel holding a pizza out on the hearth
 * before the mouth. The pointer pushes: the nearer it comes to the oven, the
 * further the peel slides the pizza toward the mouth, on a spring. At rest
 * the peel is half in, the pizza bright. The slider is the reach of the push.
 *
 * The pattern: one continuous value on the ground plane (terrain), read with
 * unproj at the hearth's height, which never moves.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rings, ringAt, run, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HZ = 20, DR = 28, DH = 26, NEAR = 46, TRAVEL = 40, REST = 0.35, PR = 10, HANDLE = 30;
const disc = (x, y, r, n = 40) => circ(Math.max(r, 0.05), n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.85);
  fit(C, [[-32, -32, 0], [32, -32, 0], [-32, 64, 0], [32, 64, 0], [-8, -14, 66], [0, NEAR + TRAVEL + PR + HANDLE, HZ]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [po, pi] = rings(-32, -32, 32, 64, 4, 1.6);
  put(solid(g), prism(P, front, po, pi, 0, HZ));
  // chimney behind the dome, then the dome over its foot
  put(solid(g), prism(P, front, circ(4, 24).map((q) => ({ ...q, u: q.u - 8, v: q.v - 14 })), null, 32, 62));
  put(solid(g), prism(P, front, disc(-8, -14, 5.6, 24), disc(-8, -14, 4.4, 24), 62, 65));
  const dome = mk("g", {}, g), dpts = [];
  for (let i = 0; i <= 8; i++) { const a = (i / 8) * (Math.PI / 2); dpts.push(...ringAt(P, disc(0, 0, DR * Math.cos(a), 48), HZ + DH * Math.sin(a))); }
  mk("path", { class: "sil", d: poly(hull(dpts)) }, dome);
  mk("path", { class: "nf lo", d: open(ringAt(P, run(disc(0, 0, DR - 1.5, 48), front), HZ + 4)) }, dome);

  // the entrance vault: an arch profile run forward from the dome, its mouth open on the front
  const arch = (w, h) => fillet([[-w, 0], [w, 0], [w, h], [-w, h]], [0.5, 0.5, w, w], 6);
  const outer = arch(12, 18), mouth = arch(8, 13);
  const at = (pts, y) => pts.map(([x, z]) => P(x, y, HZ + z));
  const vault = mk("g", {}, g);
  mk("path", { class: "sil", d: poly(hull(at(outer, 16).concat(at(outer, 34)))) }, vault);
  mk("path", { class: "nf lo", d: open(at(outer, 34).slice(2)) + poly(at(mouth, 34)) + seg(P(-8, 30, HZ), P(8, 30, HZ)) }, vault);

  // the peel and its pizza, slid along y
  const peel = solid(g), pizza = solid(g), tops = mk("path", { class: "nf lo" }, pizza.g);
  pizza.sil.classList.add("hi");
  const sp = spring(REST);
  let last = NaN;
  function draw(p) {
    if (Math.abs(p - last) < 1e-4) return;
    last = p;
    const y = NEAR + (1 - p) * TRAVEL;
    const blade = disc(0, y, PR + 2.5), hdl = rings(-1.6, y + PR, 1.6, y + PR + HANDLE, 1.2, 0.5)[0];
    peel.sil.setAttribute("d", poly(hull(ringAt(P, blade, HZ + 0.4).concat(ringAt(P, blade, HZ + 1.4)))) + poly(hull(ringAt(P, hdl, HZ + 0.6).concat(ringAt(P, hdl, HZ + 2.2)))));
    put(pizza, prism(P, front, disc(0, y, PR), disc(0, y, PR - 1.6), HZ + 1.4, HZ + 3));
    tops.setAttribute("d", [[-3.5, -2.5], [3, -3.5], [0.5, 2.5], [-4, 3.5], [4.5, 2.5]].map(([dx, dy]) => poly(ringAt(P, disc(dx, y + dy, 1.5, 12), HZ + 3))).join(""));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(clamp(sp.x, 0, 1)); return m; });
  bag.add(B.unregister);

  function setP(pt) {
    let on = false;
    if (pt) {
      const [x, y] = unproj(C, pt[0], pt[1], HZ);
      if (Math.abs(x) < 50 && y > -40 && y < NEAR + TRAVEL + 50) { on = true; sp.t = clamp((NEAR + TRAVEL + 20 - y) / reach, 0, 1); }
    }
    if (!on) sp.t = REST;
    read.textContent = on ? "peel " + Math.round(sp.t * 100) + "%" : "rest";
    B.wake();
  }
  setP(null);
  bag.add(pointer(stage, { move: setP, leave: () => setP(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "pizzaoven",
  means: "A dome pizza oven with a peel on its hearth: the nearer the pointer comes to the oven, the further the pizza slides in.",
  rules: [1, 3, 5, 8],
  range: [50, 80, 120],
  tour: [[84, 235], [175, 189], [241, 112], null],
  mount,
});
