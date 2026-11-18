/**
 * Belt sander: a bench belt sander, a long belt arm hinged at the back of a
 * low motor base. The pointer along the base tilts the belt arm up from flat
 * toward upright, the farther out the higher. At rest the arm lies tipped a
 * little, bright. The slider is how far the arm tilts.
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rings, unproj, spring, stepS, mk, pointer, put, register, solid, disposer } = HL;

const PX = -30, PZ = 22, R = 8, L = 76, REST = 22, SWING = 63;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-42, -22, 0], [54, 22, 0], [-40, -12, 30], [54, 12, 40], [-30, 12, 107], [-10, -12, 107]], 200, 180);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  function arm(deg) {
    const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a), o = [];
    for (let i = 0; i <= 12; i++) { const t = -Math.PI / 2 + (Math.PI * i) / 12; o.push([L + R * Math.cos(t), R * Math.sin(t)]); }
    for (let i = 0; i <= 12; i++) { const t = Math.PI / 2 + (Math.PI * i) / 12; o.push([R * Math.cos(t), R * Math.sin(t)]); }
    return o.map(([dx, dz]) => [PX + dx * c - dz * s, PZ + dx * s + dz * c]);
  }
  function ext(el, prof, y0, y1, face) {
    const pts = [], f = [];
    for (const [x, z] of prof) { pts.push(P(x, y0, z), P(x, y1, z)); f.push(P(x, y1, z)); }
    el.setAttribute("d", poly(hull(pts)) + (face ? poly(f) : ""));
  }
  const [a, b] = rings(-42, -22, 22, 22, 4, 1.2);
  const base = solid(g);
  put(base, prism(P, front, a, b, 0, 16));
  const [a2, b2] = rings(-36, -10, -24, 10, 3, 1);
  const hub = solid(g);
  put(hub, prism(P, front, a2, b2, 16, 22));
  const belt = mk("path", { class: "sil hi" }, g);
  const cover = mk("path", { class: "lo nf" }, g);
  const t = spring(REST);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const pr = arm(v);
    ext(belt, pr, -15, 15, true);
    const a = (v * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    const q = (dx, dz) => P(PX + dx * c - dz * s, 16, PZ + dx * s + dz * c);
    cover.setAttribute("d", poly([q(4, -4), q(L - 4, -4), q(L - 4, 4), q(4, 4)]));
  }
  const B = register(stage, (dt) => { const m = stepS(t, dt); draw(t.x); return m; });
  bag.add(B.unregister);
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -50 || x > 64 || y < -34 || y > 34) return -1;
    return clamp((x + 20) / 70, 0, 1);
  }
  let cur = -1;
  function set(v) {
    cur = v;
    t.t = v < 0 ? REST : REST + v * reach * SWING;
    read.textContent = v < 0 ? "rest" : Math.round(t.t) + "°";
    B.wake();
  }
  set(-1);
  bag.add(pointer(stage, { move: (p) => set(hit(p)), leave: () => set(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (cur >= 0) set(cur); }, destroy: bag.dispose };
}

hairline({
  name: "beltsander",
  means: "A bench belt sander: the pointer along the base tilts the long belt arm up from flat toward upright, farther out higher.",
  rules: [1, 3, 5, 6],
  range: [0.4, 1, 1],
  tour: [[218, 285], [274, 312], [246, 299], null],
  mount,
});
