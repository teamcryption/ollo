/**
 * Siege tower: a tall timber tower on wheels with a drawbridge ramp hinged
 * near its top. The pointer, moving down the tower, lowers the ramp from
 * upright to level and past it. At rest the ramp hangs part open, bright.
 * The slider is how far the ramp can drop.
 *
 * The pattern: one part swinging on its hinge.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rad, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TX = 34, TY = 34, TZ = 92, HZ = 64, RL = 28, Y0 = 6, Y1 = TY - 6, REST = 0.35;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[0, 0, 0], [TX + RL + 2, TY, HZ], [0, TY, 0], [TX, 0, TZ + 6], [TX, TY, 0]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the tower, then its battlement cap
  const [tr, ti] = rings(0, 0, TX, TY, 1.5, 1);
  put(solid(g), prism(P, front, tr, ti, 4, TZ));
  const [cr, ci] = rings(-3, -3, TX + 3, TY + 3, 1.5, 1);
  put(solid(g), prism(P, front, cr, ci, TZ, TZ + 6));
  // planking on the two near faces
  let pl = "";
  for (let z = 16; z < TZ; z += 12) { pl += seg(P(TX, 0, z), P(TX, TY, z)) + seg(P(0, TY, z), P(TX, TY, z)); }
  mk("path", { d: pl, class: "nf lo" }, g);
  // the doorway behind the ramp
  mk("path", { d: poly([P(TX, Y0, HZ), P(TX, Y1, HZ), P(TX, Y1, HZ + RL), P(TX, Y0, HZ + RL)]), class: "lo" }, g);
  // wheels on the near side face
  for (const x of [8, 26]) {
    const w = (y, r) => circ(r, 32).map((q) => P(x + q.u, y, 7 + q.v));
    mk("path", { d: poly(hull(w(TY, 7).concat(w(TY + 3, 7)))) }, g);
    mk("path", { d: poly(w(TY + 3, 2)), class: "nf lo" }, g);
  }
  // the ramp
  const sil = mk("path", { class: "sil hi" }, g), slats = mk("path", { class: "nf lo" }, g);
  const sp = spring(REST, { eps: 0.002 });
  let drawn = NaN;
  function draw() {
    const t = sp.x * reach;
    if (t === drawn) return;
    drawn = t;
    const a = rad(4 + t * 100), dx = Math.sin(a), dz = Math.cos(a), nx = dz * 2, nz = -dx * 2;
    const end = (y, o) => P(TX + 0.5 + RL * dx + o * nx, y, HZ + RL * dz + o * nz), base = (y, o) => P(TX + 0.5 + o * nx, y, HZ + o * nz);
    sil.setAttribute("d", poly(hull([base(Y0, 0), base(Y1, 0), end(Y0, 0), end(Y1, 0), base(Y0, 1), base(Y1, 1), end(Y0, 1), end(Y1, 1)])));
    let s = "";
    for (let k = 1; k < 5; k++) { const f = k / 5; s += seg(P(TX + 0.5 + RL * f * dx + (dx > 0.9 ? 0 : nx), Y0, HZ + RL * f * dz + (dx > 0.9 ? 0 : nz)), P(TX + 0.5 + RL * f * dx + (dx > 0.9 ? 0 : nx), Y1, HZ + RL * f * dz + (dx > 0.9 ? 0 : nz))); }
    slats.setAttribute("d", s);
  }
  draw();
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  const top = P(TX, TY / 2, TZ)[1], bot = P(TX, TY / 2, HZ - 10)[1];
  function set(t) {
    sp.t = t;
    read.textContent = t === REST ? "rest" : Math.round(4 + t * 100) + "°";
    B.wake();
  }
  set(REST);
  bag.add(pointer(stage, {
    move: ([, sy]) => set(Math.round(clamp((sy - top) / (bot - top), 0.1, 1) * 20) / 20),
    leave: () => set(REST),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; drawn = NaN; draw(); }, destroy: bag.dispose };
}

hairline({
  name: "catapultsling",
  means: "A siege tower on wheels: moving down the tower lowers its drawbridge ramp from upright to level and past it.",
  rules: [1, 3, 5, 6],
  range: [0.4, 1, 1],
  tour: [[256, 105], [256, 142], [256, 175], null],
  mount,
});
