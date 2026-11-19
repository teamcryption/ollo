/**
 * Log loader: a crawler on two tracks with a house and a cab, and a long
 * boom and stick ending in a two-tine grapple claw. The pointer's place
 * across the frame raises the boom, swings the stick out and spreads the
 * claw wide. At rest the boom sits low with the claw nearly shut, the claw
 * bright. The slider is how far the boom rises and the claw opens.
 *
 * The pattern: a chain of parts turning on fixed knuckles (lift and grip).
 */
const { Cam, clamp, fit, hull, lerp, poly, proj, rrect, seg, spring, stepS, disposer, mk, pointer, register, solid } = HL;

const PX = 62, PY = 40, PZ = 46, L1 = 82, L2 = 50, LT = 22, REST = 0.06;
const rad = (d) => (d * Math.PI) / 180;
const pose = (u) => {
  const a1 = rad(lerp(22, 60, u)), a2 = rad(lerp(-76, -42, u)), o = rad(lerp(10, 46, u));
  const k = [PX + L1 * Math.cos(a1), PZ + L1 * Math.sin(a1)], h = [k[0] + L2 * Math.cos(a2), k[1] + L2 * Math.sin(a2)];
  return { a1, a2, o, k, h };
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.7);
  const ex = [pose(0), pose(0.5), pose(1)].flatMap((p) => [[p.k[0], PY, p.k[1] + 6], [p.h[0] + 18, PY, p.h[1] - LT], [p.h[0] - 18, PY, p.h[1] - LT]]);
  fit(C, [[0, 0, 0], [92, 60, 0], [92, 0, 0], [0, 60, 0], [50, 6, 72]].concat(ex), 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const box = (parent, b, r, k, T, s0) => {
    const s = s0 || solid(parent), ring = rrect(b[0], b[1], b[3], b[4], r, 4), inner = rrect(b[0] + k, b[1] + k, b[3] - k, b[4] - k, Math.max(0.5, r - k), 4);
    const at = (rg, z) => rg.map((q) => P(...T([q.u, q.v, z])));
    s.sil.setAttribute("d", poly(hull(at(ring, b[2]).concat(at(ring, b[5])))));
    s.cr.setAttribute("d", poly(at(inner, b[5])));
    return s;
  };
  const id = (p) => p;
  const track = (y0, y1) => { box(g, [0, y0, 0, 92, y1, 16], 8, 1.6, id); mk("path", { d: seg(P(14, y1, 8), P(78, y1, 8)), class: "nf lo" }, g); };
  track(0, 16);
  box(g, [30, 22, 16, 62, 40, 22], 6, 1.4, id);
  box(g, [6, 6, 22, 72, 54, 44], 8, 2, id);
  box(g, [48, 6, 44, 74, 26, 72], 5, 1.6, id);
  mk("path", { d: seg(P(74, 8, 52), P(74, 24, 52)), class: "nf lo" }, g);
  track(44, 60);
  const boom = solid(g), stick = solid(g), head = solid(g), tines = [solid(g), solid(g)];
  tines.forEach((t) => t.sil.classList.add("hi"));
  const arm = (s, ox, oz, a, L, w) => {
    const c = Math.cos(a), sn = Math.sin(a);
    box(g, [-3, PY - w, -w, L + 3, PY + w, w], w * 0.8, 1, ([x, y, z]) => [ox + x * c - z * sn, y, oz + x * sn + z * c], s);
  };
  const sp = spring(REST);
  let last = NaN;
  function draw(u) {
    if (u === last) return;
    last = u;
    const p = pose(u);
    arm(boom, PX, PZ, p.a1, L1, 5);
    arm(stick, p.k[0], p.k[1], p.a2, L2, 3.6);
    box(g, [p.h[0] - 7, PY - 6, p.h[1] - 4, p.h[0] + 7, PY + 6, p.h[1] + 3], 3, 1, id, head);
    [-1, 1].forEach((sg, i) => arm(tines[i], p.h[0] + sg * 4, p.h[1] - 3, rad(-90) + sg * p.o, LT, 2.6));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(Math.round(sp.x * 1000) / 1000); return m; });
  bag.add(B.unregister);
  function aim(u, r) { sp.t = u; read.textContent = r ? "rest" : Math.round(u * 100) + "%"; B.wake(); }
  draw(REST);
  aim(REST, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(REST + clamp((sx - 60) / 240, 0, 1) * (max - REST)), leave: () => aim(REST, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "logloader",
  means: "A log loader on tracks: the pointer raises its long boom, swings the stick out and spreads the grapple claw wide.",
  rules: [1, 3, 5, 6],
  range: [0.5, 0.8, 1],
  tour: [[159, 156], [255, 149], [291, 108], null],
  mount,
});
