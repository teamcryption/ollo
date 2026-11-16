/**
 * Overhead projector: a low box with a glass stage, a post rising at its back
 * and a projector head on the arm above the stage. The pointer's x tilts the
 * arm forward and back about its foot, on a spring. At rest the arm leans a
 * little forward, bright. The slider is the reach of the tilt.
 */
const {
  Cam, fit, proj, facing, rings, prism, rrect, hull, poly, clamp, lerp, rad,
  spring, stepS, mk, solid, put, register, pointer, disposer,
} = HL;

const REST = 8, PY = -3, PZ = 20;
const box = (x0, y0, z0, x1, y1, z1, r) => { const q = rrect(x0, y0, x1, y1, r, 3); return [z0, z1].flatMap((z) => q.map((s) => [s.u, s.v, z])); };
const POST = box(25, -7, 12, 35, 1, 84, 3), HEAD = box(10, -10, 76, 50, 30, 94, 5), LENS = box(22, 2, 66, 38, 18, 77, 6);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[0, -34, 0], [60, 70, 0], [0, -34, 96], [60, 70, 96]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const post = mk("path", { class: "sil hi" }, g);
  const [br, bi] = rings(0, 0, 60, 58, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, 20));
  const [gr] = rings(10, 10, 50, 50, 3, 1);
  mk("path", { d: poly(gr.map((s) => P(s.u, s.v, 20))), class: "nf lo" }, g);
  const lens = mk("path", { class: "sil hi" }, g), head = mk("path", { class: "sil hi" }, g);

  const tilt = (pts, a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return pts.map(([x, y, z]) => { const dy = y - PY, dz = z - PZ; return P(x, PY + dy * c + dz * s, PZ - dy * s + dz * c); }); };
  function draw(a) {
    post.setAttribute("d", poly(hull(tilt(POST, a))));
    lens.setAttribute("d", poly(hull(tilt(LENS, a))));
    head.setAttribute("d", poly(hull(tilt(HEAD, a))));
  }
  const sp = spring(REST);
  let last = NaN;
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); if (sp.x !== last) { last = sp.x; draw(sp.x); } return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    if (sx < 50 || sx > 350 || sy < 20 || sy > 300) return leave();
    const t = clamp((sx - 110) / 180, 0, 1), a = lerp(-amp * 0.6, amp, t);
    sp.t = a;
    read.textContent = "tilt " + Math.round(a);
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "chalkeraser",
  means: "An overhead projector: the pointer tilts its arm and head forward and back over the glass stage.",
  rules: [1, 3, 5, 8],
  range: [0, 26, 34],
  tour: [[279, 89], [155, 81], [215, 120], null],
  mount,
});
