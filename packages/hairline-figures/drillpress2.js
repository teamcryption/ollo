/**
 * Arbor press: a cast base with an anvil plate, a column, a head over the
 * anvil with the ram sliding through it, and a long hand lever on a pinion
 * hub. The pointer's place along the press swings the lever down and drives
 * the ram onto the anvil. At rest the lever stands up, bright, the ram high.
 * The slider is the lever's throw.
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rings, unproj, spring, stepS, mk, pointer, put, register, solid, disposer } = HL;

const PX = 30, PY = 22, PZ = 53, L = 36, A0 = 72, A1 = -38;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.95);
  fit(C, [[0, 0, 0], [44, 26, 0], [0, 26, 0], [44, 0, 0], [4, 6, 62], [42, 22, 90], [62, 22, 28]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  function blk(s, x0, y0, x1, y1, z0, z1) {
    const [a, b] = rings(x0, y0, x1, y1, 1.6, Math.min(0.9, Math.min(x1 - x0, y1 - y0) / 2 - 0.2));
    put(s, prism(P, front, a, b, z0, z1));
  }
  blk(solid(g), 0, 0, 44, 26, 0, 6);
  blk(solid(g), 20, 6, 38, 20, 6, 10);
  blk(solid(g), 4, 7, 14, 19, 6, 62);
  const ram = solid(g);
  blk(solid(g), 4, 6, 34, 20, 44, 60);
  // pinion hub on the head's front face
  const hub = [];
  for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; for (const y of [20, 23.5]) hub.push(P(PX + 4.5 * Math.cos(a), y, PZ + 4.5 * Math.sin(a))); }
  mk("path", { class: "sil", d: poly(hull(hub)) }, g);
  const lev = mk("path", { class: "sil" }, g);
  const t = spring(0, { k: 110, c: 19 });
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    blk(ram, 25, 10, 31, 16, 40 - v * 27, 46);
    const a = ((A0 + (A1 - A0) * v) * Math.PI) / 180, ex = PX + L * Math.cos(a), ez = PZ + L * Math.sin(a);
    const pts = [];
    for (let i = 0; i < 12; i++) {
      const b = (i / 12) * Math.PI * 2;
      pts.push(P(PX + 1.6 * Math.cos(b), PY, PZ + 1.6 * Math.sin(b)), P(PX + 1.6 * Math.cos(b), PY + 2, PZ + 1.6 * Math.sin(b)));
      pts.push(P(ex + 1.6 * Math.cos(b), PY, ez + 1.6 * Math.sin(b)), P(ex + 1.6 * Math.cos(b), PY + 2, ez + 1.6 * Math.sin(b)));
    }
    const knob = [];
    for (let i = 0; i < 16; i++) { const b = (i / 16) * Math.PI * 2; knob.push(P(ex + 3.6 * Math.cos(b), PY + 1, ez + 3.6 * Math.sin(b)), P(ex, PY + 1 + 3.6 * Math.cos(b), ez + 3.6 * Math.sin(b))); }
    lev.setAttribute("d", poly(hull(pts)) + poly(hull(knob)));
  }
  lev.classList.add("hi");
  const B = register(stage, (dt) => { const m = stepS(t, dt); draw(t.x); return m; });
  bag.add(B.unregister);
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 30);
    if (x < -8 || x > 66 || y < -10 || y > 40) return -1;
    return clamp((x - 6) / 42, 0, 1);
  }
  let cur = -2;
  function set(v) {
    cur = v;
    t.t = v < 0 ? 0 : v * reach;
    read.textContent = v < 0 ? "rest" : Math.round(t.t * 100) + "%";
    B.wake();
  }
  set(-1);
  bag.add(pointer(stage, { move: (p) => set(hit(p)), leave: () => set(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (cur >= 0) set(cur); }, destroy: bag.dispose };
}

hairline({
  name: "drillpress2",
  means: "An arbor press: the pointer along the press swings the hand lever down and drives the ram onto the anvil.",
  rules: [1, 3, 5, 6],
  range: [0.4, 1, 1],
  tour: [[175, 152], [216, 173], [258, 194], null],
  mount,
});
