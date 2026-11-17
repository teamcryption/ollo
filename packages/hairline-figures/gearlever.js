/**
 * Parking brake: a centre console with a handbrake lever lying along it.
 * The pointer over the console pulls the lever up about its pivot, the
 * slider sets how far it is pulled. At rest the lever sits slightly raised,
 * bright.
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, unproj, spring, stepS, disposer, mk, pointer, put, register, solid, rad } = HL;

const V = [0.612, 0.612, 0.5], REST = 10;
const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
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
  const C = Cam(45, 0.5, 2.35);
  const PY = 92, PZ = 14, L = 84;
  fit(C, [[-4, -4, 0], [44, 104, 0], [44, -4, 0], [-4, 104, 0], [20, PY - L * Math.cos(rad(70)), PZ + L * Math.sin(rad(70)) + 10]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [r0, r1] = rings(0, 0, 40, 100, 8, 2);
  put(solid(g), prism(P, front, r0, r1, 0, PZ - 4));
  const [s0, s1] = rings(12, 70, 28, 100, 6, 1.5);
  put(solid(g), prism(P, front, s0, s1, PZ - 4, PZ));
  const lev = solid(g), cap = solid(g);
  lev.sil.classList.add("hi");
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const d = [0, -Math.cos(rad(a)), Math.sin(rad(a))], n = [0, Math.sin(rad(a)), Math.cos(rad(a))];
    const o = add([13, PY, PZ], n, -2);
    const b = box(P, o, [[14, 0, 0], d.map((x) => x * L), n.map((x) => x * 9)]);
    lev.sil.setAttribute("d", b.sil); lev.cr.setAttribute("d", b.cr);
    const o2 = add(add([16, PY, PZ], d, L), n, 1);
    const c = box(P, o2, [[8, 0, 0], d.map((x) => x * 7), n.map((x) => x * 6)]);
    cap.sil.setAttribute("d", c.sil); cap.cr.setAttribute("d", c.cr);
  }
  const sp = spring(REST);
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function setOn(a) {
    on = a; sp.t = a ? amt : REST; read.textContent = a ? "up " + Math.round(amt) : "rest";
    B.wake();
  }
  const over = ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, 0); return x > -30 && x < 70 && y > -30 && y < 130; };
  bag.add(pointer(stage, { move: (p) => setOn(over(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (on) setOn(true); }, destroy: bag.dispose };
}

hairline({
  name: "gearlever",
  means: "A handbrake lever on a centre console: the pointer pulls it up about its pivot, the slider sets how far.",
  rules: [1, 3, 5, 8],
  range: [30, 50, 70],
  tour: [[217, 170], [190, 160], [240, 175], null],
  mount,
});
