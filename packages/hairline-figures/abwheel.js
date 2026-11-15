/**
 * Ab roller: a wheel on a long axle with two handles, standing on an
 * exercise mat whose far end is still rolled up. The pointer's place along
 * the mat is where the roller goes: it rolls out on a spring, its spokes
 * turning as it travels. At rest it waits near the roll. The slider is how
 * far down the mat it may reach.
 *
 * The pattern: one part following the pointer along a track (terrain).
 */
const {
  Cam, fit, poly, prism, proj, rings, facing, hull, seg, clamp, lerp, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 19, T = 12, HL_ = 18, HR = 3, MX0 = 0, MX1 = 190, MY = 30, X0 = 44, XM = 172, REST = 52;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[MX0, -MY, 0], [MX1, -MY, 0], [MX0, MY, 0], [MX1, MY, 0], [X0, 0, 2 * R + 2], [XM, 0, 2 * R + 2]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [mr, mi] = rings(MX0 + 6, -MY, MX1, MY, 3, 1.4);
  put(solid(g), prism(P, front, mr, mi, 0, 1.4));
  const ring = (x, z, r, y, n = 32) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; o.push(P(x + r * Math.cos(t), y, z + r * Math.sin(t))); } return o; };
  const cylY = (x, z, r, ya, yb) => poly(hull(ring(x, z, r, ya).concat(ring(x, z, r, yb))));
  // the rolled-up end of the mat
  mk("path", { d: cylY(10, 9, 9, -MY, MY), class: "sil" }, g);
  mk("path", { d: poly(ring(10, 9, 9, MY)) + poly(ring(10, 9, 4.5, MY)), class: "nf lo" }, g);
  mk("path", { d: seg(P(10, MY, 18), P(18, MY, 1.4)), class: "lo" }, g);

  const farH = mk("path", { class: "sil" }, g), farCap = mk("path", { class: "nf lo" }, g);
  const wheel = mk("path", { class: "sil hi" }, g), face = mk("path", { class: "nf lo" }, g), spokes = mk("path", { class: "nf" }, g);
  const nearH = mk("path", { class: "sil" }, g), nearCap = mk("path", { class: "nf lo" }, g);
  const pos = spring(REST);
  let last = NaN;

  function draw(x) {
    if (x === last) return;
    last = x;
    const z = R + 1.4, y0 = -T / 2, y1 = T / 2, th = -(x - X0) / R;
    farH.setAttribute("d", cylY(x, z, HR, y0 - HL_, y0));
    farCap.setAttribute("d", seg(...[-1, 1].map((s) => P(x, y0 - HL_ * 0.55, z + s * HR))));
    wheel.setAttribute("d", cylY(x, z, R, y0, y1));
    face.setAttribute("d", poly(ring(x, z, R - 4, y1, 40)) + poly(ring(x, z, 4, y1, 20)));
    let s = "";
    for (let k = 0; k < 3; k++) { const a = th + (k * 2 * Math.PI) / 3; s += seg(P(x + 5 * Math.cos(a), y1, z + 5 * Math.sin(a)), P(x + (R - 6) * Math.cos(a), y1, z + (R - 6) * Math.sin(a))); }
    spokes.setAttribute("d", s);
    nearH.setAttribute("d", cylY(x, z, HR, y1, y1 + HL_));
    nearCap.setAttribute("d", poly(ring(x, z, HR - 1, y1 + HL_, 16)) + seg(...[-1, 1].map((s2) => P(x, y1 + HL_ * 0.45, z + s2 * HR))));
  }

  const B = register(stage, (dt) => { const m = stepS(pos, dt); draw(pos.x); return m; });
  bag.add(B.unregister);

  function aim(t) {
    pos.t = t;
    read.textContent = t === REST ? "rest" : Math.round(((t - X0) / (XM - X0)) * 100) + "%";
    B.wake();
  }
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 0);
    if (Math.abs(wy) > MY + 20 || wx < MX0 - 10 || wx > MX1 + 20) return aim(REST);
    aim(Math.round(clamp(wx, X0, lerp(X0 + 30, XM, reach))));
  }
  aim(REST);
  draw(REST);
  bag.add(pointer(stage, { move, leave: () => aim(REST) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "abwheel",
  means: "An ab roller on a mat with a rolled-up end: it rolls out along the mat to the pointer, its spokes turning as it goes.",
  rules: [1, 3, 5, 8],
  range: [0, 100, 100],
  tour: [[160, 157], [274, 214], [302, 228], null],
  mount,
});
