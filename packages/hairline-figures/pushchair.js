/**
 * Pushchair: a seat body on four wheels, a push handle at the back and a
 * folding hood of arched ribs hinged over the seat. The pointer over the
 * pushchair opens the hood forward, rib by rib; at rest it is half folded,
 * its front rib bright. The slider is how far the hood reaches.
 *
 * The pattern: one part answering (fold).
 */
const {
  Cam, fit, facing, prism, proj, rings, poly, hull, open, clamp, unproj, rad,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const L = 44, W = 26, BZ = 16, TZ = 34, HX = 10, NR = 5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amax = 60 + value * 35;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-18, -2, 0], [L + 8, W + 4, 0], [L + 8, -2, 0], [-18, W + 4, 0], [-18, W / 2, 72], [HX + 20, W / 2, TZ + 22]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => {
    const pts = [];
    for (let i = 0; i < 20; i++) { const t = (i / 20) * Math.PI * 2; for (const dy of [-1.6, 1.6]) pts.push(P(x + 8 * Math.cos(t), y + dy, 8 + 8 * Math.sin(t))); }
    put(solid(g), { sil: poly(hull(pts)), crease: "" });
  };
  // handle, far wheels, frame, body, near wheels
  mk("path", { d: open([P(2, 0, TZ), P(-16, 0, 70), P(-16, W, 70), P(2, W, TZ)]), class: "sil nf" }, g);
  wheel(4, -1); wheel(L - 4, -1);
  mk("path", { d: open([P(4, -1, 8), P(14, 0, BZ), P(L - 4, -1, 8)]) + open([P(4, W + 1, 8), P(14, W, BZ), P(L - 4, W + 1, 8)]), class: "lo nf" }, g);
  const [br, bi] = rings(0, 0, L, W, 7, 1.8);
  put(solid(g), prism(P, front, br, bi, BZ, TZ));
  wheel(4, W + 1); wheel(L - 4, W + 1);

  // the hood: arched ribs across the width, hinged on an axis along y at (HX, TZ)
  const hood = solid(g), ribs = mk("path", { class: "lo nf" }, g), lead = mk("path", { class: "sil hi nf" }, g);
  const rib = (phi) => {
    const pts = [];
    for (let i = 0; i <= 16; i++) { const s = (i / 16) * Math.PI, h = 20 * Math.sin(s), y = W / 2 - (W / 2 + 1) * Math.cos(s); pts.push(P(HX + h * Math.sin(phi), y, TZ + h * Math.cos(phi))); }
    return pts;
  };
  const sp = spring(0.08);
  let last = NaN;
  function draw(p) {
    if (p === last) return;
    last = p;
    const a1 = rad(-35 + p * (amax + 35)), all = [];
    let rs = "";
    for (let k = 0; k < NR; k++) { const r = rib(rad(-35) + (a1 - rad(-35)) * (k / (NR - 1))); all.push(...r); if (k < NR - 1) rs += open(r); }
    hood.sil.setAttribute("d", poly(hull(all)));
    ribs.setAttribute("d", rs);
    lead.setAttribute("d", open(rib(a1)));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  draw(sp.x);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TZ);
    const inside = x > -18 && x < L + 8 && y > -4 && y < W + 4;
    sp.t = inside ? 1 : 0.08;
    read.textContent = inside ? "hood " + Math.round(sp.t * 100) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, { move, leave: () => { sp.t = 0.08; read.textContent = "rest"; B.wake(); } }));
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amax = 60 + v * 35; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "pushchair",
  means: "A pushchair on four wheels with a folding hood: over it, the hood opens forward over the seat, rib by rib.",
  rules: [1, 3, 5, 8],
  range: [0, 0.5, 1],
  tour: [[225, 174], [200, 160], [240, 195], null],
  mount,
});
