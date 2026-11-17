/**
 * Charge port: a car's side panel with a round charging socket and the
 * square flap that covers it, hinged at one edge. The pointer over the
 * panel swings the flap open; the slider sets how wide. At rest the flap
 * stands ajar, bright.
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, unproj, spring, stepS, disposer, mk, pointer, put, register, solid, rad } = HL;

const V = [0.612, 0.612, 0.5], REST = 14, HX = 26, FW = 40, FZ = 14, PY = 14;
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
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[0, 0, 0], [100, 0, 0], [0, PY + FW + 4, 0], [100, PY, 0], [0, 0, 74], [100, PY, 74]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [r0, r1] = rings(0, 0, 100, PY, 6, 2);
  put(solid(g), prism(P, front, r0, r1, 0, 74));
  const cx = HX + FW / 2, cz = FZ + FW / 2;
  const ring = (r) => poly(Array.from({ length: 36 }, (_, i) => P(cx + r * Math.cos((i / 36) * 6.283), PY, cz + r * Math.sin((i / 36) * 6.283))));
  mk("path", { d: poly([P(HX - 3, PY, FZ - 3), P(HX + FW + 3, PY, FZ - 3), P(HX + FW + 3, PY, FZ + FW + 3), P(HX - 3, PY, FZ + FW + 3)]), class: "nf lo" }, g);
  mk("path", { d: ring(14), class: "nf" }, g);
  mk("path", { d: ring(7), class: "nf lo" }, g);
  const flap = solid(g);
  flap.sil.classList.add("hi");
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const f = [Math.cos(rad(a)), Math.sin(rad(a)), 0], n = [-f[1], f[0], 0];
    const b = box(P, [HX, PY, FZ], [f.map((x) => x * FW), n.map((x) => x * 3), [0, 0, FW]]);
    flap.sil.setAttribute("d", b.sil); flap.cr.setAttribute("d", b.cr);
  }
  const sp = spring(REST);
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function setOn(a) {
    on = a; sp.t = a ? REST + amt : REST;
    read.textContent = a ? "open " + Math.round(amt) : "rest";
    B.wake();
  }
  const over = ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, 0); return x > -40 && x < 140 && y > -40 && y < 100; };
  bag.add(pointer(stage, { move: (p) => setOn(over(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (on) setOn(true); }, destroy: bag.dispose };
}

hairline({
  name: "fuelflap",
  means: "A charge port on a car's side panel: the pointer swings its hinged flap open off the socket, the slider sets how wide.",
  rules: [1, 3, 5, 6],
  range: [40, 70, 100],
  tour: [[210, 171], [237, 187], [175, 160], null],
  mount,
});
