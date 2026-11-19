/**
 * Biplane: two stacked wings joined by struts, a round cowl and a big
 * two-blade propeller. The pointer's x spins the propeller and the plane
 * rolls with it. The propeller is the bright mark.
 */
const { Cam, fit, proj, hull, poly, open, clamp, spring, stepS, disposer, mk, pointer, register } = HL;
const S = 2.2, Z0 = 40;
const disc = (x, r, y = 0, z = Z0, n = 16) => { const o = []; for (let k = 0; k < n; k++) { const t = (k / n) * 2 * Math.PI; o.push([x, y + r * Math.cos(t), z + r * Math.sin(t)]); } return o; };
const box = (x0, x1, y0, y1, z0, z1) => { const o = []; [x0, x1].forEach((x) => [y0, y1].forEach((y) => [z0, z1].forEach((z) => o.push([x, y, z])))); return o; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, S);
  fit(C, [[-48, -60, Z0 - 40], [52, 60, Z0 + 30], [-48, 0, Z0 + 34], [52, 0, Z0 - 40]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const n = ["wheelF", "low", "fin", "stabF", "body", "stabN", "wheelN", "strutF", "strutN", "wing", "cowl", "hubA", "hubB"];
  const el = {};
  n.forEach((k) => (el[k] = mk("path", { class: k === "cowl" ? "nf lo" : k.startsWith("strut") ? "nf lo" : "sil" }, g)));
  el.hubA.classList.add("hi"); el.hubB.classList.add("hi");
  const phi = spring(0.5, { k: 60, c: 14 });
  let last = NaN;
  function draw() {
    if (phi.x === last) return; last = phi.x;
    const t = phi.x, r = clamp(0.1 + (t - 0.5) * 0.09, -0.5, 0.55), cr = Math.cos(r), sr = Math.sin(r);
    const W = (p) => { const y = p[1], z = p[2] - Z0; return [p[0], y * cr - z * sr, Z0 + y * sr + z * cr]; };
    const T = (p) => P(...W(p));
    const sh = (pts) => poly(hull(pts.map(T)));
    const wh = (y) => { const o = []; for (let k = 0; k < 16; k++) { const q = (k / 16) * 2 * Math.PI; [y - 1.5, y + 1.5].forEach((yy) => o.push([14 + 6 * Math.cos(q), yy, Z0 - 30 + 6 * Math.sin(q)])); } return o; };
    const strut = (y) => [[0, y, Z0 - 6], [-2, y, Z0 + 16], [12, y, Z0 - 6], [10, y, Z0 + 16], [14, y * 0.12, Z0 - 24], [12, y * 0.02, Z0 - 6]].map(T);
    const sp = (y) => { const q = strut(y); return open([q[0], q[1]]) + open([q[2], q[3]]) + open([q[4], q[5]]); };
    el.wheelF.setAttribute("d", sh(wh(-10))); el.wheelN.setAttribute("d", sh(wh(10)));
    el.low.setAttribute("d", sh(box(-2, 14, -56, 56, Z0 - 8, Z0 - 5)));
    el.strutF.setAttribute("d", sp(-40) + sp(-14)); el.strutN.setAttribute("d", sp(14) + sp(40));
    el.fin.setAttribute("d", sh(box(-48, -32, -1.5, 1.5, Z0 + 4, Z0 + 10).concat(box(-48, -42, -1.5, 1.5, Z0 + 24, Z0 + 26))));
    el.stabF.setAttribute("d", sh(box(-48, -36, -20, 0, Z0 + 2, Z0 + 4)));
    el.stabN.setAttribute("d", sh(box(-48, -36, 0, 20, Z0 + 2, Z0 + 4)));
    el.wing.setAttribute("d", sh(box(-4, 14, -58, 58, Z0 + 16, Z0 + 19)));
    el.body.setAttribute("d", sh(disc(-48, 3).concat(disc(-20, 8), disc(8, 10, 0, Z0 + 1), disc(34, 10))));
    el.cowl.setAttribute("d", poly(disc(34, 7.5).map(T)));
    [1, -1].forEach((s, i) => {
      const a = t * 2.4, c = Math.cos(a) * s, d = Math.sin(a) * s, pts = [];
      [38, 41].forEach((x) => {
        [[3, 3], [15, 6], [25, 3.5]].forEach(([u, w]) => { for (let k = 0; k < 10; k++) { const q = (k / 10) * 2 * Math.PI, uu = u + Math.cos(q) * w * 0.6, vv = Math.sin(q) * w; pts.push([x, uu * c - vv * d, Z0 + uu * d + vv * c]); } });
      });
      (i ? el.hubB : el.hubA).setAttribute("d", sh(pts));
    });
  }
  const B = register(stage, (dt) => { const m = stepS(phi, dt); draw(); return m; });
  bag.add(B.unregister);
  function move([sx]) {
    phi.t = 0.5 + clamp((sx - 200) / 200, -1, 1) * gain * Math.PI * 1.5;
    read.textContent = Math.round(((phi.t - 0.5) * 2.4 * 180) / Math.PI) + "°";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave: () => { phi.t = 0.5; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = clamp(v, 0.25, 1.5); }, destroy: bag.dispose };
}

hairline({
  name: "biplane",
  means: "A biplane: the pointer's x spins the big propeller on its nose, and the plane rolls with its two strutted wings as it turns.",
  rules: [3, 4, 5, 8],
  range: [0.25, 0.75, 1.5],
  tour: [[228, 205], [110, 160], [300, 150], null],
  mount,
});
