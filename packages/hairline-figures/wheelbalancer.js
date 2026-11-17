/**
 * Wheel balancer: a garage machine with a wheel on its shaft and a guard
 * hood above. The pointer on the figure swings the hood down over the tyre
 * and spins the wheel with the pointer's x; leaving lifts the hood back. At
 * rest the hood stands raised, bright. The slider is how far the wheel spins.
 *
 * The pattern: one part answering a continuous input (spring).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, seg, spring, stepS, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const WX = 60, WY = 16, WZ = 34, R = 24, W0 = 52, W1 = 66, HR = 30, HOPEN = 0.5 * Math.PI;
const ring = (x, R0, n = 36, a0 = 0, a1 = 2 * Math.PI) => {
  const o = [];
  for (let i = 0; i <= n; i++) { const t = a0 + ((a1 - a0) * i) / n; o.push([x, WY + R0 * Math.cos(t), WZ + R0 * Math.sin(t)]); }
  return o;
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let span = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[0, -16, 0], [44, 34, 0], [W1 + 4, WY + HR, 0], [W1 + 4, WY - HR, WZ + HR], [0, -16, WZ + HR], [W1, WY, WZ + HR]], 200, 160);
  const P = proj(C), front = facing(C);
  const pr = (pts) => pts.map((q) => P(q[0], q[1], q[2]));
  const g = mk("g", {}, svg);
  // floor plate and cabinet
  const [fr, fi] = rings(-4, -16, W1 + 6, 36, 4, 1.5);
  put(solid(g), prism(P, front, fr, fi, 0, 2));
  const [br, bi] = rings(0, -4, 42, 34, 3, 1.5);
  put(solid(g), prism(P, front, br, bi, 2, 30));
  const hoodG = mk("g", {}, g);
  const hood = mk("path", { class: "sil hi" }, hoodG), hoodIn = mk("path", { class: "nf lo" }, hoodG);
  const wheelG = mk("g", {}, g);
  mk("path", { d: poly(hull(pr([[42, WY - 3, WZ], [42, WY + 3, WZ], [W0, WY - 3, WZ], [W0, WY + 3, WZ], [42, WY, WZ - 3], [42, WY, WZ + 3], [W0, WY, WZ + 3], [W0, WY, WZ - 3]]))) }, wheelG);
  mk("path", { d: poly(hull(pr(ring(W0, R).concat(ring(W1, R))))), class: "sil" }, wheelG);
  mk("path", { d: poly(pr(ring(W1, R))) }, wheelG);
  mk("path", { d: poly(pr(ring(W1, R - 7))), class: "nf lo" }, wheelG);
  const spokes = mk("path", { class: "nf" }, wheelG);
  mk("path", { d: poly(pr(ring(W1 + 1, 4, 16))) }, wheelG);

  const h = spring(HOPEN, { k: 70, c: 15 }), a = spring(0.3, { k: 60, c: 14 });
  let lh = NaN, la = NaN, behind = null;
  function draw() {
    if (h.x !== lh) {
      lh = h.x;
      const o = ring(W0 - 2, HR, 24, h.x, h.x + Math.PI).concat(ring(W1 + 3, HR, 24, h.x, h.x + Math.PI));
      hood.setAttribute("d", poly(hull(pr(o))));
      hoodIn.setAttribute("d", poly(pr(ring(W1 + 3, HR - 3, 24, h.x, h.x + Math.PI))));
      const b = h.x > 0.3 * Math.PI;
      if (b !== behind) { behind = b; if (b) wheelG.before(hoodG); else wheelG.after(hoodG); }
    }
    if (a.x !== la) {
      la = a.x;
      let d = "";
      for (let k = 0; k < 5; k++) {
        const t = a.x + (k * 2 * Math.PI) / 5, c = Math.cos(t), s = Math.sin(t);
        d += seg(P(W1, WY + 4 * c, WZ + 4 * s), P(W1, WY + (R - 7) * c, WZ + (R - 7) * s));
      }
      spokes.setAttribute("d", d);
    }
  }
  const B = register(stage, (dt) => {
    const m1 = stepS(h, dt), m2 = stepS(a, dt);
    draw();
    return m1 || m2;
  });
  bag.add(B.unregister);
  draw();
  read.textContent = "rest";

  const mid = P(30, 16, 20);
  function move([sx, sy]) {
    const on = Math.abs(sx - mid[0]) < 150 && Math.abs(sy - mid[1]) < 130;
    if (!on) return leave();
    h.t = 0.02;
    const f = clamp((sx - mid[0] + 150) / 300, 0, 1);
    a.t = 0.3 + f * (span * Math.PI) / 180;
    read.textContent = Math.round(f * span) + "°";
    B.wake();
  }
  function leave() { h.t = HOPEN; a.t = 0.3; read.textContent = "rest"; B.wake(); }
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { span = v; }, destroy: bag.dispose };
}

hairline({
  name: "wheelbalancer",
  means: "A wheel balancer: the pointer swings the guard hood down over the tyre and spins the wheel; leaving lifts the hood.",
  rules: [1, 3, 5, 6],
  range: [90, 360, 720],
  tour: [[205, 131], [162, 206], [122, 116], null],
  mount,
});
