/**
 * Pinwheel: four folded vanes on a hub at the top of a stick standing in a
 * small block. The pointer's x turns the wheel; the vane whose tip ends up
 * nearest the pointer goes bright. At rest one vane is bright.
 */
const { Cam, fit, proj, hull, poly, open, clamp, spring, stepS, disposer, mk, pointer, register } = HL;
const H = 100, R = 62, S = 1.55, N = [0.94, 0.34, 0], E1 = [-0.34, 0.94, 0];
const ring = (r, z, n = 24) => { const o = []; for (let k = 0; k < n; k++) { const t = (k / n) * 2 * Math.PI; o.push([r * Math.cos(t), r * Math.sin(t), z]); } return o; };
const at = (r, t, f = 0) => [r * Math.cos(t) * E1[0] + f * N[0], r * Math.cos(t) * E1[1] + f * N[1], H + r * Math.sin(t)];
const dep = (p) => (p[0] + p[1]) * 0.61 + p[2] * 0.5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, S);
  fit(C, [at(R, 0), at(R, Math.PI), at(R, Math.PI / 2), [0, 0, 0], [16, 16, 0], [-16, -16, 0]], 200, 160);
  const P = proj(C), pp = (p) => P(p[0], p[1], p[2]);
  const g = mk("g", {}, svg);
  mk("path", { class: "sil", d: poly(hull(ring(16, 0).concat(ring(16, 8)).map(pp))) }, g);
  mk("path", { class: "nf lo", d: poly(ring(13, 8).map(pp)) }, g);
  mk("path", { class: "sil", d: poly(hull(ring(2.2, 8, 12).concat(ring(2.2, H - 2, 12)).map(pp))) }, g);
  const vanes = [0, 1, 2, 3].map(() => { const v = mk("g", {}, g); return { g: v, plate: mk("path", { class: "sil" }, v), fold: mk("path", { class: "nf lo" }, v) }; });
  const pin = mk("ellipse", { rx: 3.2 * S, ry: 3.2 * S, class: "sil" }, g);
  const hp = pp(at(0, 0, 6)); pin.setAttribute("cx", hp[0]); pin.setAttribute("cy", hp[1]);
  const phi = spring(0.35, { k: 60, c: 14 });
  let last = NaN, act = -2;
  function draw() {
    if (phi.x === last) return; last = phi.x;
    const order = vanes.map((v, k) => {
      const t = phi.x + (k * Math.PI) / 2, hub = at(0, 0), a = at(R * 0.5, t - 0.7), tip = at(R, t), fold = at(R * 0.55, t + 0.75, 16);
      v.plate.setAttribute("d", poly([hub, a, tip, fold].map(pp)));
      v.fold.setAttribute("d", open([tip, at(5, t + 0.3, 3)].map(pp)));
      return [dep(tip) + dep(fold), v];
    }).sort((x, y) => x[0] - y[0]);
    order.forEach(([, v]) => g.insertBefore(v.g, pin));
  }
  const B = register(stage, (dt) => { const m = stepS(phi, dt); draw(); return m; });
  bag.add(B.unregister);
  function choose(k) {
    if (k === act) return; act = k;
    vanes.forEach((v, q) => v.plate.classList.toggle("hi", q === (k < 0 ? 0 : k)));
  }
  function move([sx, sy]) {
    phi.t = 0.35 + ((sx - 200) / 200) * gain * Math.PI;
    let best = 0, bd = Infinity;
    vanes.forEach((_, k) => { const s = pp(at(R, phi.t + (k * Math.PI) / 2)); const d = Math.hypot(s[0] - sx, s[1] - sy); if (d < bd) { bd = d; best = k; } });
    choose(best);
    read.textContent = Math.round((((phi.t - 0.35) * 180) / Math.PI)) + "°";
    B.wake();
  }
  choose(-1); read.textContent = "rest";
  bag.add(pointer(stage, { move, leave: () => { phi.t = 0.35; choose(-1); read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = clamp(v, 0.25, 1.5); }, destroy: bag.dispose };
}

hairline({
  name: "pinwheel",
  means: "A toy pinwheel on a stick: the pointer's x turns the four vanes and the vane nearest the pointer goes bright.",
  rules: [1, 3, 4, 8],
  range: [0.25, 0.75, 1.5],
  tour: [[118, 145], [310, 110], [282, 107], null],
  mount,
});
