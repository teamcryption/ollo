/**
 * Glider: a slim sailplane with very long wings and a T-tail. The pointer's
 * x throws the two ailerons opposite ways and the glider banks after them.
 * The ailerons are the bright mark.
 */
const { Cam, fit, proj, hull, poly, clamp, spring, stepS, disposer, mk, pointer, register } = HL;
const S = 1.9, Z0 = 50;
const disc = (x, r, y = 0, z = Z0, n = 14) => { const o = []; for (let k = 0; k < n; k++) { const t = (k / n) * 2 * Math.PI; o.push([x, y + r * Math.cos(t), z + r * Math.sin(t)]); } return o; };
const box = (x0, x1, y0, y1, z0, z1) => { const o = []; [x0, x1].forEach((x) => [y0, y1].forEach((y) => [z0, z1].forEach((z) => o.push([x, y, z])))); return o; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, S);
  fit(C, [[-2, -96, Z0 + 50], [-2, 96, Z0 - 50], [14, 96, Z0 - 50], [-60, 0, Z0 + 24], [40, 0, Z0 - 6]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const n = ["ailF", "wingF", "fin", "stab", "body", "canopy", "wingN", "ailN"];
  const el = {};
  n.forEach((k) => (el[k] = mk("path", { class: k === "canopy" ? "nf lo" : "sil" }, g)));
  el.ailF.classList.add("hi"); el.ailN.classList.add("hi");
  const phi = spring(0.5, { k: 60, c: 14 });
  let last = NaN;
  function draw() {
    if (phi.x === last) return; last = phi.x;
    const t = phi.x, r = clamp(0.12 + (t - 0.5) * 0.14, -0.55, 0.65), cr = Math.cos(r), sr = Math.sin(r);
    const d = clamp(0.18 + (t - 0.5) * 0.3, -0.7, 0.7);
    const T = (p) => { const y = p[1], z = p[2] - Z0; return P(p[0], y * cr - z * sr, Z0 + y * sr + z * cr); };
    const sh = (pts) => poly(hull(pts.map(T)));
    const ail = (y0, y1, s) => box(-10, -2, y0, y1, Z0 + 4, Z0 + 5).map(([x, y, z]) => { const u = x + 2, a = d * s; return [-2 + u * Math.cos(a), y, z - u * Math.sin(a)]; });
    el.ailF.setAttribute("d", sh(ail(-94, -54, 1)));
    el.ailN.setAttribute("d", sh(ail(54, 94, -1)));
    el.wingF.setAttribute("d", sh(box(-2, 14, -4, -4, Z0 + 4, Z0 + 6).concat(box(-2, 6, -95, -95, Z0 + 4, Z0 + 5))));
    el.wingN.setAttribute("d", sh(box(-2, 14, 4, 4, Z0 + 4, Z0 + 6).concat(box(-2, 6, 95, 95, Z0 + 4, Z0 + 5))));
    el.fin.setAttribute("d", sh(box(-62, -50, -1, 1, Z0 + 1, Z0 + 4).concat(box(-62, -56, -1, 1, Z0 + 22, Z0 + 22))));
    el.stab.setAttribute("d", sh(box(-64, -56, -20, 20, Z0 + 21, Z0 + 23)));
    el.body.setAttribute("d", sh(disc(-60, 1.5).concat(disc(-20, 3), disc(10, 6, 0, Z0 + 1), disc(30, 4), disc(40, 1.5))));
    el.canopy.setAttribute("d", poly(disc(20, 4.2, 0, Z0 + 4).filter((p) => p[2] >= Z0 + 4).concat([[10, 0, Z0 + 7]]).map(T)));
  }
  const B = register(stage, (dt) => { const m = stepS(phi, dt); draw(); return m; });
  bag.add(B.unregister);
  function move([sx]) {
    phi.t = 0.5 + clamp((sx - 200) / 200, -1, 1) * gain * 4;
    read.textContent = Math.round((clamp(0.12 + (phi.t - 0.5) * 0.14, -0.55, 0.65) * 180) / Math.PI) + "°";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave: () => { phi.t = 0.5; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = clamp(v, 0.25, 1.5); }, destroy: bag.dispose };
}

hairline({
  name: "glider",
  means: "A glider with long wings: the pointer's x throws the ailerons opposite ways and the sailplane banks after them.",
  rules: [3, 4, 5, 8],
  range: [0.25, 0.75, 1.5],
  tour: [[96, 202], [294, 102], [200, 166], null],
  mount,
});
