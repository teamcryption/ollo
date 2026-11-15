/**
 * Bench grinder: a motor on a pedestal with a wheel on each end of its shaft,
 * each wheel under a hood-shaped guard. The pointer toward the near wheel
 * swings the guards back over the shaft, baring the wheels. At rest the
 * guards close over the tops, the near one bright. The slider is the swing.
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rings, unproj, spring, stepS, mk, pointer, put, register, solid, disposer } = HL;

const Z = 20, RW = 13, RG = 16;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.75);
  fit(C, [[-10, -24, 0], [10, 24, 0], [-17, -24, 37], [17, 24, 37], [-17, 24, 3], [17, -24, 3]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  function cyl(el, y0, y1, r, a0, a1, face) {
    const pts = [], f = [];
    for (let i = 0; i <= 28; i++) {
      const a = ((a0 + ((a1 - a0) * i) / 28) * Math.PI) / 180, x = r * Math.cos(a), z = Z + r * Math.sin(a);
      pts.push(P(x, y0, z), P(x, y1, z)); f.push(P(x, y1, z));
    }
    if (a1 - a0 < 360) { pts.push(P(0, y0, Z), P(0, y1, Z)); f.push(P(0, y1, Z)); }
    el.setAttribute("d", poly(hull(pts)) + (face ? poly(f) : ""));
  }
  const [a, b] = rings(-8, -7, 8, 7, 2, 0.8);
  const ped = solid(g);
  put(ped, prism(P, front, a, b, 0, 12));
  const wf = mk("path", { class: "sil" }, g), gf = mk("path", { class: "sil" }, g);
  const mot = mk("path", { class: "sil" }, g);
  cyl(mot, -14, 14, 9, 0, 360, true);
  cyl(wf, -21, -16, RW, 0, 360, true);
  const wn = mk("path", { class: "sil" }, g), gn = mk("path", { class: "sil" }, g);
  cyl(wn, 16, 21, RW, 0, 360, true);
  gn.classList.add("hi");
  const t = spring(0, { k: 100, c: 18 });
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const s = v * 105;
    cyl(gf, -22, -15, RG, -10 + s * 0.8, 175 + s * 0.8, true);
    cyl(gn, 15, 22, RG, -10 + s, 175 + s, true);
  }
  const B = register(stage, (dt) => { const m = stepS(t, dt); draw(t.x); return m; });
  bag.add(B.unregister);
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, Z);
    if (x < -24 || x > 24 || y < -30 || y > 30) return -1;
    return clamp((y + 12) / 32, 0, 1);
  }
  let cur = -1;
  function set(v) {
    cur = v;
    t.t = v < 0 ? 0 : v * reach;
    read.textContent = v < 0 ? "rest" : Math.round(t.t * 105) + "°";
    B.wake();
  }
  set(-1);
  bag.add(pointer(stage, { move: (p) => set(hit(p)), leave: () => set(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (cur >= 0) set(cur); }, destroy: bag.dispose };
}

hairline({
  name: "benchgrinder",
  means: "A bench grinder: the pointer toward the near wheel swings both hood guards back over the shaft, baring the wheels.",
  rules: [1, 3, 5, 6],
  range: [0.4, 1, 1],
  tour: [[258, 133], [200, 162], [142, 191], null],
  mount,
});
