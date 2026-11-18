/**
 * Gyrocopter: a small open pod under a long two-blade rotor on a mast, with
 * a pusher propeller behind the seat and a tail boom. The pointer's x spins
 * the rotor round its mast and the pusher prop with it. The rotor is bright.
 */
const { Cam, fit, proj, hull, poly, open, clamp, spring, stepS, disposer, mk, pointer, register } = HL;
const S = 1.85, Z0 = 30, ZR = Z0 + 34;
const disc = (x, r, y = 0, z = Z0, n = 16) => { const o = []; for (let k = 0; k < n; k++) { const t = (k / n) * 2 * Math.PI; o.push([x, y + r * Math.cos(t), z + r * Math.sin(t)]); } return o; };
const box = (x0, x1, y0, y1, z0, z1) => { const o = []; [x0, x1].forEach((x) => [y0, y1].forEach((y) => [z0, z1].forEach((z) => o.push([x, y, z])))); return o; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, S);
  fit(C, [[-78, -78, ZR], [78, 78, ZR], [-78, 78, ZR], [78, -78, ZR], [0, 0, Z0 - 26]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const n = ["boom", "fin", "wheelF", "prop", "pod", "seat", "wheelN", "legs", "mast", "bladeA", "bladeB", "hub"];
  const el = {};
  n.forEach((k) => (el[k] = mk("path", { class: k === "seat" || k === "legs" || k === "mast" ? "nf lo" : "sil" }, g)));
  ["bladeA", "bladeB", "hub"].forEach((k) => el[k].classList.add("hi"));
  const phi = spring(0.5, { k: 60, c: 14 });
  let last = NaN;
  const sh = (pts) => poly(hull(pts.map((p) => P(...p))));
  const wh = (y) => { const o = []; for (let k = 0; k < 16; k++) { const q = (k / 16) * 2 * Math.PI; [y - 1.5, y + 1.5].forEach((yy) => o.push([6 + 5 * Math.cos(q), yy, Z0 - 21 + 5 * Math.sin(q)])); } return o; };
  el.boom.setAttribute("d", sh(disc(-20, 2.5, 0, Z0 + 2).concat(disc(-60, 2, 0, Z0 + 4))));
  el.fin.setAttribute("d", sh(box(-70, -58, -1.2, 1.2, Z0 - 4, Z0 + 16)));
  el.wheelF.setAttribute("d", sh(wh(-16)));
  el.pod.setAttribute("d", sh(disc(-10, 6).concat(disc(4, 12, 0, Z0 + 1), disc(22, 10), disc(34, 4, 0, Z0 - 2))));
  el.seat.setAttribute("d", poly([[2, -6, Z0 + 12], [18, -6, Z0 + 9], [18, 6, Z0 + 9], [2, 6, Z0 + 12]].map((p) => P(...p))));
  el.wheelN.setAttribute("d", sh(wh(16)));
  const L = (a, b) => open([P(...a), P(...b)]);
  el.legs.setAttribute("d", L([6, -6, Z0 - 8], [6, -16, Z0 - 20]) + L([6, 6, Z0 - 8], [6, 16, Z0 - 20]) + L([32, 0, Z0 - 4], [36, 0, Z0 - 20]));
  el.mast.setAttribute("d", L([-4, 0, Z0 + 10], [-2, 0, ZR]) + L([4, 0, Z0 + 12], [-2, 0, ZR - 6]));
  el.hub.setAttribute("d", sh(disc(-2, 3, 0, ZR, 12).map(([x, y, z]) => [x + (z - ZR), y, ZR + (x + 2) * 0.3])));
  function draw() {
    if (phi.x === last) return; last = phi.x;
    const t = phi.x, a = -0.62 + (t - 0.5) * 1.2;
    [0, Math.PI].forEach((o, i) => {
      const c = Math.cos(a + o), s = Math.sin(a + o), pts = [];
      [[5, 3], [74, 3.5]].forEach(([u, w]) => [-w, w].forEach((v) => [ZR, ZR + 1.5].forEach((z) => pts.push([-2 + u * c - v * s, u * s + v * c, z]))));
      (i ? el.bladeB : el.bladeA).setAttribute("d", sh(pts));
    });
    const b = t * 3, cb = Math.cos(b), sb = Math.sin(b), pp = [];
    [-15, -13].forEach((x) => [1, -1].forEach((k) => [[2, 2.5], [9, 4], [15, 2.5]].forEach(([u, w]) => { for (let j = 0; j < 8; j++) { const q = (j / 8) * 2 * Math.PI, uu = k * (u + Math.cos(q) * w * 0.6), vv = Math.sin(q) * w; pp.push([x, uu * cb - vv * sb, Z0 + 4 + uu * sb + vv * cb]); } })));
    el.prop.setAttribute("d", sh(pp));
  }
  const B = register(stage, (dt) => { const m = stepS(phi, dt); draw(); return m; });
  bag.add(B.unregister);
  function move([sx]) {
    phi.t = 0.5 + clamp((sx - 200) / 200, -1, 1) * gain * Math.PI * 1.5;
    read.textContent = Math.round(((phi.t - 0.5) * 1.2 * 180) / Math.PI) + "°";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave: () => { phi.t = 0.5; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = clamp(v, 0.25, 1.5); }, destroy: bag.dispose };
}

hairline({
  name: "gyrocopter",
  means: "A gyrocopter: the pointer's x spins the long rotor round its mast, and the pusher propeller behind the seat turns with it.",
  rules: [3, 4, 5, 8],
  range: [0.25, 0.75, 1.5],
  tour: [[278, 205], [122, 181], [320, 150], null],
  mount,
});
