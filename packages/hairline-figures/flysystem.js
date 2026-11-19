/**
 * Fly system: a painted drop hung from a batten under the grid, its lift
 * lines running up to a head block and down to a counterweight arbor on its
 * track at the side. The pointer's height flies the drop out on a spring,
 * and the arbor runs down as the drop goes up. At rest the drop hangs low,
 * bright. The slider is how high it can fly.
 *
 * The pattern: a continuous slide, read from a fixed band (the pointer's height).
 */
const {
  Cam, clamp, fit, hull, poly, proj, seg, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const W = 110, TOP = 122, DH = 46, HMAX = 66, REST = 16;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.7);
  fit(C, [[-8, -16, -4], [W + 28, 12, -4], [W + 28, -16, -4], [-8, 12, -4], [-8, 0, TOP + 6], [W + 28, 0, TOP + 6]], 200, 168);
  const P = proj(C), g = mk("g", {}, svg);
  const boxPts = (x0, y0, z0, x1, y1, z1) => { const o = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push(P(x, y, z)); return o; };
  const box = (cls, x0, y0, z0, x1, y1, z1, parent = g) => {
    mk("path", { d: poly(hull(boxPts(x0, y0, z0, x1, y1, z1))), class: cls }, parent);
    mk("path", { d: poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(([x, y]) => P(x, y, z1))), class: "nf lo" }, parent);
  };
  box("sil", -8, -16, -4, W + 28, 12, 0);
  for (let x = 14; x < W + 20; x += 18) mk("path", { d: seg(P(x, -14, 0), P(x, 10, 0)), class: "lo" }, g);
  box("sil", W + 22, 3, 0, W + 25, 7, TOP);
  box("sil", -6, -4, TOP, W + 26, 4, TOP + 5);
  // the head block: a sheave over the arbor track
  const sheave = [];
  for (let k = 0; k < 24; k++) { const a = (k / 24) * 2 * Math.PI; sheave.push(P(W + 18 + 7 * Math.cos(a), 0, TOP + 5 + 7 * Math.sin(a))); }
  mk("path", { d: poly(sheave), class: "" }, g);
  mk("path", { d: seg(P(W + 18, 0, TOP + 5), P(W + 18, 0, TOP + 5.5)), class: "lo" }, g);
  const lines = mk("path", { class: "lo" }, g);
  const drop = mk("g", {}, g), arbor = mk("g", {}, g);
  const LX = [14, W / 2, W - 14];

  const h = spring(REST);
  let last = NaN;
  function draw() {
    if (h.x === last) return;
    last = h.x;
    const z = h.x, a = TOP - 34 - z * 1.05;
    drop.replaceChildren(); arbor.replaceChildren();
    mk("path", { d: poly(hull(boxPts(6, -1, z, W - 6, 1, z + DH))), class: "sil hi" }, drop);
    const seams = [];
    for (const s of [0.3, 0.55, 0.8]) seams.push(seg(P(8, 1, z + DH * s), P(W - 8, 1, z + DH * s)));
    seams.push(open([[20, 0.3], [40, 0.62], [58, 0.45], [78, 0.75], [W - 18, 0.55]].map(([x, f]) => P(x, 1, z + DH * f * 0.55 + 2))));
    mk("path", { d: seams.join(""), class: "nf lo" }, drop);
    box("sil", 2, -2, z + DH, W - 2, 2, z + DH + 3, drop);
    box("sil", W + 14, -3, a, W + 22, 3, a + 28, arbor);
    for (let k = 1; k < 5; k++) mk("path", { d: seg(P(W + 14, 3, a + k * 5.6), P(W + 22, 3, a + k * 5.6)), class: "lo" }, arbor);
    lines.setAttribute("d", LX.map((x) => seg(P(x, 0, z + DH + 3), P(x, 0, TOP))).join("") + seg(P(W + 11, 0, TOP + 5), P(W + 11, 0, 2)) + seg(P(W + 18, 0, TOP - 2), P(W + 18, 0, a + 28)));
  }
  const open = (pts) => "M" + pts.map((p) => p[0].toFixed(2) + " " + p[1].toFixed(2)).join("L");
  const B = register(stage, (dt) => { const m = stepS(h, dt); draw(); return m; });
  bag.add(B.unregister);
  const y0 = P(W / 2, 0, 0)[1], y1 = P(W / 2, 0, TOP)[1];
  function aim(p) {
    const on = !!p;
    const f = on ? clamp((y0 - p[1]) / (y0 - y1), 0, 1) : 0;
    h.t = on ? Math.max(REST * 0.4, f * HMAX * reach) : REST;
    read.textContent = on ? "out " + Math.round(h.t) : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "flysystem",
  means: "A theatre fly system: the pointer's height flies the drop up on its batten while the counterweight arbor runs down.",
  rules: [1, 3, 5, 6],
  range: [0.3, 0.8, 1],
  tour: [[186, 73], [186, 250], [186, 161], null],
  mount,
});
