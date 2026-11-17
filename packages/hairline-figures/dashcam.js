/**
 * Dash cam: a camera body with its lens, on a short stem and suction puck
 * on the dashboard. The pointer over the dash swivels the camera about its
 * stem; the slider sets how far it turns. At rest it faces a little aside,
 * bright.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, unproj, spring, stepS, disposer, mk, pointer, put, register, solid, rad } = HL;

const V = [0.612, 0.612, 0.5], REST = 20, Z0 = 6;
const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
function box(P, o, e) {
  const c = (a, b, d) => P(...add(add(add(o, e[0], a), e[1], b), e[2], d));
  const all = [];
  for (const a of [0, 1]) for (const b of [0, 1]) for (const d of [0, 1]) all.push(c(a, b, d));
  const faces = [];
  for (let i = 0; i < 3; i++) for (const s of [0, 1]) {
    if ((s ? 1 : -1) * dot(e[i], V) <= 0) continue;
    const j = (i + 1) % 3, k = (i + 2) % 3, q = (u, w) => { const t = [0, 0, 0]; t[i] = s; t[j] = u; t[k] = w; return c(...t); };
    faces.push(poly([q(0, 0), q(1, 0), q(1, 1), q(0, 1)]));
  }
  return { sil: poly(hull(all)), cr: faces.join(" ") };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value, on = false;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-44, -44, 0], [44, 44, 0], [44, -44, 0], [-44, 44, 0], [0, 0, 50]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [r0, r1] = rings(-44, -44, 44, 44, 10, 2.2);
  put(solid(g), prism(P, front, r0, r1, 0, Z0));
  put(solid(g), prism(P, front, disc(0, 0, 13), disc(0, 0, 10), Z0, Z0 + 3));
  put(solid(g), prism(P, front, disc(0, 0, 4, 20), disc(0, 0, 3, 20), Z0 + 3, Z0 + 14));
  const body = solid(g), lens = solid(g);
  body.sil.classList.add("hi");
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const f = [Math.cos(rad(a)), Math.sin(rad(a)), 0], s = [-f[1], f[0], 0], z = [0, 0, 1];
    const bz = Z0 + 14;
    const b = box(P, add(add([0, 0, bz], f, -20), s, -15), [f.map((x) => x * 40), s.map((x) => x * 30), [0, 0, 26]]);
    body.sil.setAttribute("d", b.sil); body.cr.setAttribute("d", b.cr);
    const l = box(P, add(add([0, 0, bz + 6], f, 20), s, -8), [f.map((x) => x * 12), s.map((x) => x * 16), z.map((x) => x * 14)]);
    lens.sil.setAttribute("d", l.sil); lens.cr.setAttribute("d", l.cr);
    if (dot(f, V) > 0) body.g.after(lens.g); else body.g.before(lens.g);
  }
  const sp = spring(REST);
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function setOn(a) {
    on = a; sp.t = a ? REST + amt : REST;
    read.textContent = a ? "turn " + Math.round(amt) : "rest";
    B.wake();
  }
  const over = ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, Z0); return Math.abs(x) < 70 && Math.abs(y) < 70; };
  bag.add(pointer(stage, { move: (p) => setOn(over(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (on) setOn(true); }, destroy: bag.dispose };
}

hairline({
  name: "dashcam",
  means: "A dash cam on a stem over the dashboard: the pointer swivels the camera about its stem, the slider sets how far it turns.",
  rules: [1, 3, 5, 6],
  range: [60, 110, 160],
  tour: [[200, 89], [225, 120], [165, 110], null],
  mount,
});
