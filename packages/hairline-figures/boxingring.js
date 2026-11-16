/**
 * Ring bell: a dome bell on a post, a hammer hung on a stand beside it.
 * Under the pointer the hammer swings in to strike the rim and the bell
 * rocks on its post. At rest the hammer is drawn back, bright. The slider is
 * how far the bell rocks.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = 34, DR = 30, DH = 24, PY = -DR - 12, PZ = H + 26, ARM = 30;
const rx = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]; };
const line = (pts) => "M" + pts.map((q) => q[0].toFixed(2) + "," + q[1].toFixed(2)).join("L");

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let rock = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-34, PY - 10, 0], [34, DR + 8, 0], [-34, DR + 8, 0], [34, PY - 10, 0], [0, 0, H + DH + 12], [0, PY, PZ + 6]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [r0, i0] = rings(-34, PY - 10, 34, DR + 8, 6, 2);
  put(solid(g), prism(P, front, r0, i0, 0, 6));
  const [rs, is] = rings(-4, PY - 4, 4, PY + 4, 2, 1);
  put(solid(g), prism(P, front, rs, is, 6, PZ + 4));
  const hammer = mk("path", { class: "sil" }, g), head = mk("path", {}, g);
  const [rp, ip] = rings(-5, -5, 5, 5, 3, 1.2);
  put(solid(g), prism(P, front, rp, ip, 6, H + 2));
  const bell = mk("path", { class: "sil" }, g), band = mk("path", { class: "nf lo" }, g), knob = mk("path", {}, g);

  const sw = tween(0), last = [NaN, NaN];
  const boxPts = (x0, x1, y0, y1, z0, z1, f) => { const o = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push(P(...f([x, y, z]))); return o; };
  function draw(t) {
    if (t === last[0] && rock === last[1]) return;
    last[0] = t; last[1] = rock;
    const ha = ((-38 + 62 * t) * Math.PI) / 180, ba = (rock * 16 * t * Math.PI) / 180;
    const hf = (p) => { const q = rx(p, ha); return [q[0], q[1] + PY, q[2] + PZ]; };
    hammer.setAttribute("d", poly(hull(boxPts(-1.5, 1.5, -1.5, 1.5, -ARM, 2, hf))));
    head.setAttribute("d", poly(hull(boxPts(-7, 7, -3.5, 3.5, -ARM - 6, -ARM + 2, hf))));
    const bf = (p) => { const q = rx(p, ba); return [q[0], q[1], q[2] + H + 2]; };
    const pts = [], bandPts = [], kp = [];
    for (let i = 0; i <= 6; i++) {
      const h = (i / 6) * DH, r = DR * Math.sqrt(Math.max(0, 1 - (h / DH) ** 2)) + 0.01;
      for (let j = 0; j < 40; j++) { const a = (j / 40) * Math.PI * 2; pts.push(P(...bf([r * Math.cos(a), r * Math.sin(a), h]))); }
    }
    const rb = DR * Math.sqrt(1 - 0.35 ** 2);
    for (let j = 0; j <= 20; j++) { const a = -Math.PI / 4 + (j / 20) * Math.PI; bandPts.push(P(...bf([rb * Math.cos(a), rb * Math.sin(a), DH * 0.35]))); }
    bell.setAttribute("d", poly(hull(pts)));
    band.setAttribute("d", line(bandPts));
    for (let j = 0; j < 16; j++) { const a = (j / 16) * Math.PI * 2; for (const z of [DH - 1, DH + 5]) kp.push(P(...bf([3.5 * Math.cos(a), 3.5 * Math.sin(a), z]))); }
    knob.setAttribute("d", poly(hull(kp)));
  }

  const B = register(stage, (_dt, now) => { draw(tval(sw, now)); return !tdone(sw, now); });
  bag.add(B.unregister);

  const mid = P(0, -6, H + DH / 2);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(sw, a > 0 ? 1 : 0, performance.now(), 0);
    hammer.classList.toggle("hi", a <= 0);
    bell.classList.toggle("hi", a > 0);
    read.textContent = a > 0 ? "ding" : "rest";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < 95 ? 1 : -1), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { rock = v; last[1] = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "boxingring",
  means: "A ring bell on a post: under the pointer the hammer swings in to strike the rim and the bell rocks on its post.",
  rules: [1, 3, 4, 5],
  range: [0.3, 1, 1.6],
  tour: [[190, 101], [251, 71], [190, 101], null],
  mount,
});
