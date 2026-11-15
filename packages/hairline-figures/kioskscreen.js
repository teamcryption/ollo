/**
 * Digital totem: a tall slab of a screen on a low plinth. The slab turns
 * on its base to face the pointer, as far as the slider allows. At rest it
 * stands turned a little off the viewer, its screen frame bright.
 */
const { Cam, fit, proj, poly, clamp, rad, rings, prism, facing, unproj, spring, stepS, mk, pointer, put, solid, register, disposer } = HL;

const HW = 15, HD = 5, TOP = 104, BZ = 5, VIEW = -45, REST = -20;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lim = value;
  const C = Cam(45, 0.5, 2.62);
  fit(C, [[-28, -20, 0], [28, 20, 0], [-16, -16, TOP], [16, 16, TOP]], 200, 160);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const [br, bi] = rings(-27, -19, 27, 19, 6, 1.8);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const [r0, i0] = rings(-HW, -HD, HW, HD, 3, 1.2);
  const body = solid(g), scr = mk("path", { class: "sil" }, g), cont = mk("path", { class: "nf lo" }, g), slot = mk("path", { class: "nf" }, g);
  const th = spring(REST, { k: 80, c: 15 });

  const rot = (ring, a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c })); };
  function draw(a) {
    put(body, prism(P, front, rot(r0, a), rot(i0, a), BZ, TOP));
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const at = (x, z) => P(x * c - HD * s, x * s + HD * c, z);
    const rect = (x0, x1, z0, z1) => poly([at(x0, z0), at(x1, z0), at(x1, z1), at(x0, z1)]);
    const vis = front({ nu: -s, nv: c });
    if (!vis) { scr.setAttribute("d", ""); cont.setAttribute("d", ""); slot.setAttribute("d", ""); }
    if (!vis) return;
    scr.setAttribute("d", rect(-11, 11, 34, 98));
    let d = rect(-8, 8, 62, 94);
    for (const [x1, z] of [[8, 55], [3, 50], [6, 45], [-1, 40]]) d += "M" + at(-8, z).join(",") + "L" + at(x1, z).join(",");
    cont.setAttribute("d", d);
    slot.setAttribute("d", rect(-6, 6, 18, 26));
  }
  draw(REST);

  const B = register(stage, (dt) => {
    const m = stepS(th, dt);
    draw(th.x);
    read.textContent = Math.abs(th.x - REST) < 0.5 && th.t === REST ? "rest" : Math.round(th.x - VIEW) + "°";
    return m;
  });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    let a = (Math.atan2(-x, y) * 180) / Math.PI;
    if (Math.hypot(x, y) < 8) a = VIEW;
    th.t = clamp(a, VIEW - lim, VIEW + lim);
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave: () => { th.t = REST; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lim = v; }, destroy: bag.dispose };
}

hairline({
  name: "kioskscreen",
  means: "A digital signage totem on a plinth: the slab turns on its base to face the pointer, screen and all.",
  rules: [1, 3, 4, 5],
  range: [30, 60, 85],
  tour: [[98, 247], [300, 240], [215, 300], null],
  mount,
});
