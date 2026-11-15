/**
 * Pet ramp: a low bed with a cleated ramp leaning against its edge. The ramp
 * slides out to put its foot under the pointer on the floor, so it runs from
 * steep to gentle; the cleats follow. At rest it leans steeply, bright. The
 * slider is how far it can reach.
 *
 * The pattern: one part following the pointer along a line (tilt and slide).
 */
const {
  Cam, clamp, fit, facing, hull, open, poly, prism, proj, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 56, BY = 64, BH = 42, Y0 = 16, Y1 = 48, TH = 3, REST = 34;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[0, 0, 0], [BX + 110, Y0, 0], [BX + 110, Y1, 0], [0, BY, 0], [0, 0, BH + 10], [BX, BY, BH + 10]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, BX, BY, 6, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, BH));
  const [cr, ci] = rings(5, 5, BX - 5, BY - 5, 10, 2);
  put(solid(g), prism(P, front, cr, ci, BH, BH + 8));
  const lip = mk("path", { class: "nf lo", d: open([P(BX, Y0 - 2, BH - 1), P(BX, Y1 + 2, BH - 1)]) }, g);
  const guide = mk("path", { class: "nf dash" }, g);
  const slab = mk("path", { class: "sil" }, g), top = mk("path", { class: "nf lo" }, g), cleats = mk("path", { class: "nf" }, g);
  const d = spring(REST, { k: 90, c: 16 });
  let last = NaN;
  function draw(r) {
    if (Math.abs(r - last) < 1e-3) return;
    last = r;
    const L = Math.hypot(r, BH), nx = BH / L, nz = r / L;
    const at = (t, y, o) => P(BX + r * t + nx * o, y, BH * (1 - t) + nz * o);
    const pts = [];
    for (const t of [0, 1]) for (const y of [Y0, Y1]) for (const o of [0, TH]) pts.push(at(t, y, o));
    slab.setAttribute("d", poly(hull(pts)));
    top.setAttribute("d", poly([at(0, Y0, TH), at(1, Y0, TH), at(1, Y1, TH), at(0, Y1, TH)]));
    let c = "";
    const n = Math.max(2, Math.round(L / 11));
    for (let i = 1; i < n; i++) { const t = i / n; c += seg(at(t, Y0 + 2, TH + 1.6), at(t, Y1 - 2, TH + 1.6)) + seg(at(t, Y0 + 2, TH), at(t, Y0 + 2, TH + 1.6)); }
    cleats.setAttribute("d", c);
    guide.setAttribute("d", open([P(BX, Y1, 0), P(BX + r, Y1, 0)]));
  }
  const B = register(stage, (dt) => { const m = stepS(d, dt); draw(d.x); return m; });
  bag.add(B.unregister);
  const deg = (r) => Math.round((Math.atan2(BH, r) * 180) / Math.PI) + "°";
  function aim(p) {
    if (!p) { d.t = REST; slab.classList.add("hi"); read.textContent = "rest"; B.wake(); return; }
    const [qx] = unproj(C, p[0], p[1], 0);
    d.t = clamp(qx - BX, 24, reach);
    read.textContent = deg(d.t);
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "catcarrier",
  means: "A pet ramp against a low bed: it slides its foot out to the pointer on the floor, running from steep to gentle.",
  rules: [1, 3, 4, 5],
  range: [60, 110, 110],
  tour: [[223, 220], [284, 250], [338, 278], null],
  mount,
});
