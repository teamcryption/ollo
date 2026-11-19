/**
 * Ham radio: a transceiver box with a slide-rule frequency window and one
 * big bar-grip tuning knob on its front. The pointer's place across the set
 * turns the knob, and the scale in the window slides with it. At rest the
 * knob sits part-way round, bright. The slider is how far the knob can turn.
 *
 * The pattern: one part answering a continuous input (spring).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, seg, spring, stepS, clamp, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 90, Y1 = 46, Z1 = 42, CX = 60, CZ = 20, R = 15, D = 9, REST = 40;
const WX0 = 8, WX1 = 40, WZ0 = 22, WZ1 = 33;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[0, 0, 0], [X1, Y1 + D, 0], [X1, 0, Z1], [0, Y1, Z1], [X1, Y1, 0], [0, 0, Z1 + 12]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, X1, Y1, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, Z1));
  const hb = [[14, 8, Z1], [14, 8, Z1 + 8], [X1 - 14, 8, Z1 + 8], [X1 - 14, 8, Z1]].map((q) => P(...q));
  mk("path", { d: "M" + hb.map((p) => p.join(",")).join("L"), class: "nf" }, g);
  const F = (x, z, d = 0) => P(x, Y1 + d, z);
  // the window, its sliding scale and fixed marker
  mk("path", { d: poly([F(WX0, WZ0), F(WX1, WZ0), F(WX1, WZ1), F(WX0, WZ1)]) }, g);
  const scale = mk("path", { class: "nf lo" }, g);
  mk("path", { d: seg(F((WX0 + WX1) / 2, WZ0 - 1, 0.3), F((WX0 + WX1) / 2, WZ1 + 1, 0.3)), class: "nf" }, g);
  for (let i = 0; i < 4; i++) {
    const x = WX0 + 2 + i * 8;
    mk("path", { d: poly([F(x, 8), F(x + 5, 8), F(x + 5, 12), F(x, 12)]), class: "lo" }, g);
  }
  // the knob: a short skirt with a long bar grip standing out of it
  const disc = (d) => circ(R, 40).map((q) => F(CX + q.u, CZ + q.v, d));
  const kg = mk("g", {}, g);
  mk("path", { d: poly(hull(disc(0).concat(disc(2.5)))) }, kg);
  const ticks = mk("path", { class: "nf lo" }, kg);
  const bar = mk("path", { class: "sil hi" }, kg), face = mk("path", {}, kg);
  const grip = mk("path", { class: "nf" }, kg);
  const sp = spring(REST);
  let last = NaN;
  const BL = R * 1.15, BW = 4.5;
  const at = (a, u, v, d) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return F(CX + u * c - v * s, CZ + u * s + v * c, d); };
  const barPts = (a, d) => [[-BL, -BW], [BL, -BW * 0.6], [BL, BW * 0.6], [-BL, BW]].map(([u, v]) => at(a, u, v, d));

  function draw(a) {
    if (a === last) return;
    last = a;
    let d = "";
    for (let k = 0; k < 12; k++) d += seg(at(a + k * 30 + 15, R * 0.68, 0, 2.5), at(a + k * 30 + 15, R * 0.95, 0, 2.5));
    ticks.setAttribute("d", d);
    bar.setAttribute("d", poly(hull(barPts(a, 2.5).concat(barPts(a, D + 3)))));
    face.setAttribute("d", poly(barPts(a, D + 3)));
    grip.setAttribute("d", seg(at(a, BL * 0.3, 0, D + 3), at(a, BL * 0.9, 0, D + 3)) + seg(at(a, -BL * 0.9, 0, D + 3), at(a, -BL * 0.3, 0, D + 3)));
    const off = (((a * 0.12) % 6) + 6) % 6;
    let s = "";
    for (let i = 0; i < 7; i++) {
      const x = WX0 + 1 + off + i * 5;
      if (x <= WX1 - 1) s += seg(F(x, WZ0 + 2, 0.2), F(x, i % 2 ? WZ1 - 4 : WZ1 - 2, 0.2));
    }
    scale.setAttribute("d", s);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const L = P(0, Y1, 0)[0], Rt = P(X1, 0, 0)[0];
  bag.add(pointer(stage, {
    move: ([sx]) => {
      const f = clamp((sx - L) / (Rt - L), 0, 1);
      sp.t = REST + amp * 220 * (f - 0.1);
      read.textContent = (7 + f * 0.3).toFixed(3);
      B.wake();
    },
    leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  draw(REST);
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "hamradio",
  means: "A ham radio transceiver: moving across it turns the big bar tuning knob, and the frequency scale slides in its window.",
  rules: [3, 5, 6, 8],
  range: [0.3, 0.7, 1],
  tour: [[233, 226], [167, 160], [233, 264], null],
  mount,
});
