/**
 * Power station: a portable battery box with a carry handle on top and a
 * front panel of a display and two outlets. The box turns on the ground to
 * face the pointer, front panel first. At rest it stands turned a little
 * aside and its body is bright. The slider is how far it may turn.
 */
const { Cam, circ, clamp, fit, facing, poly, prism, proj, rings, rrect, unproj, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const W = 46, D = 28, H = 32, REST = -0.55;
const rot = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.95);
  const R = Math.hypot(W, D) / 2;
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [0, 0, H + 7]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const body = solid(g);
  const panel = mk("path", { class: "nf lo" }, g);
  const holes = mk("path", { class: "nf" }, g);
  const posts = mk("path", { class: "nf" }, g);
  const bar = solid(g);
  const [br, bi] = rings(-W / 2, -D / 2, W / 2, D / 2, 4, 1.6);
  const [hr, hi] = rings(-W / 2 + 6, -1.6, W / 2 - 6, 1.6, 1.6, 0.5);
  const disp = rrect(-17, 17, -3, 26, 1.2, 3), hole = circ(2.4, 12), hole2 = circ(0.6, 6);
  const sp = spring(REST);
  let last = NaN;
  function draw(a) {
    put(body, prism(P, front, rot(br, a), rot(bi, a), 0, H));
    const c = Math.cos(a), s = Math.sin(a);
    const at = (u, v, z) => P(u * c - v * s, u * s + v * c, z);
    const show = front({ u: 0, v: 0, nu: -s, nv: c });
    panel.setAttribute("d", show ? poly(disp.map((q) => at(q.u, D / 2, q.v))) : "");
    let k = "";
    if (show) for (const cu of [7, 16]) {
      k += poly(hole.map((q) => at(cu + q.u, D / 2, 12 + q.v)));
      k += poly(hole2.map((q) => at(cu - 0.9 + q.u, D / 2, 12 + q.v))) + poly(hole2.map((q) => at(cu + 0.9 + q.u, D / 2, 12 + q.v)));
    }
    holes.setAttribute("d", k);
    posts.setAttribute("d", seg(at(-W / 2 + 7, 0, H), at(-W / 2 + 7, 0, H + 5)) + seg(at(W / 2 - 7, 0, H), at(W / 2 - 7, 0, H + 5)));
    put(bar, prism(P, front, rot(hr, a), rot(hi, a), H + 5, H + 7));
  }
  body.sil.classList.add("hi");
  const L = register(stage, (dt) => {
    const m = stepS(sp, dt);
    if (sp.x !== last) { draw(sp.x); last = sp.x; }
    return m;
  });
  bag.add(L.unregister);
  function aim(p) {
    if (!p) { sp.t = REST; read.textContent = "rest"; L.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 0);
    const a = clamp(Math.atan2(y, x) - Math.PI / 2, -1.6 * reach, 0.6 * reach);
    sp.t = a;
    read.textContent = `${Math.round((a * 180) / Math.PI)}°`;
    L.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "batterypack",
  means: "A portable power station: the battery box turns on the ground to face the pointer, display and outlets first.",
  rules: [1, 3, 4, 5],
  range: [0.4, 1, 1],
  tour: [[298, 258], [60, 251], [354, 244], null],
  mount,
});
