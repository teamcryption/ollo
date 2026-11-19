/**
 * Glider airbrakes: one long tapered sailplane wing, its airbrake blades
 * set in a slot across the span, one above the wing and one below. The
 * pointer's place across the frame pushes the blades out of the wing, as
 * on a steep approach. At rest they stand a little out, the upper bright.
 * The slider is how far they can open.
 *
 * The pattern: one rising part (lift).
 */
const { Cam, clamp, facing, fit, hull, open, poly, prism, proj, rings, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const SPAN = 220, Z0 = 30, H = 34, X0 = 50, X1 = 160, BY = 21, REST = 0.35;
const lead = (x) => (8 * x) / SPAN, chord = (x) => 52 - (22 * x) / SPAN, thick = (x) => 8 - (4 * x) / SPAN;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.45);
  fit(C, [[0, 0, Z0], [SPAN, 40, Z0], [0, 52, Z0], [X0, BY, Z0 + 6 + H + 2], [X1, BY, Z0 - H * 0.8 - 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const lower = solid(g);
  const rib = (x) => { const o = []; for (let k = 0; k <= 12; k++) { const u = k / 12, s = Math.sin(Math.PI * Math.pow(u, 0.7)); o.push(P(x, lead(x) + u * chord(x), Z0 + thick(x) * s)); o.push(P(x, lead(x) + u * chord(x), Z0 - thick(x) * 0.3 * s)); } return o; };
  const wing = solid(g); wing.sil.setAttribute("d", poly(hull(rib(0).concat(rib(SPAN)))));
  const ridge = (u) => [0, SPAN].map((x) => P(x, lead(x) + u * chord(x), Z0 + thick(x) * Math.sin(Math.PI * Math.pow(u, 0.7))));
  mk("path", { d: open(ridge(0.36)), class: "nf lo" }, g);
  const topAt = (x) => Z0 + thick(x) * 0.97;
  const slot = [P(X0, BY - 1, topAt(X0)), P(X1, BY - 1, topAt(X1)), P(X1, BY + 4, topAt(X1)), P(X0, BY + 4, topAt(X0))];
  mk("path", { d: poly(slot), class: "nf lo" }, g);
  mk("path", { d: open([P(SPAN - 70, lead(SPAN - 70) + chord(SPAN - 70) * 0.78, topAt(SPAN - 70) - 2), P(SPAN - 4, lead(SPAN - 4) + chord(SPAN - 4) * 0.78, topAt(SPAN) - 1.5)]), class: "nf lo" }, g);
  const upper = solid(g), cap = solid(g);
  upper.sil.classList.add("hi"); cap.sil.classList.add("hi");
  const [bo, bi] = rings(X0, BY, X1, BY + 3, 1.2, 0.5);
  const [co, ci] = rings(X0 - 1, BY - 2, X1 + 1, BY + 5, 1.5, 0.8);

  let last = NaN;
  function draw(t) {
    if (Math.abs(t - last) < 0.0005) return;
    last = t;
    const h = H * t, zt = Z0 + 4.5 + h;
    put(upper, prism(P, front, bo, bi, Z0 + 4.5, zt));
    put(cap, prism(P, front, co, ci, zt, zt + 1.6));
    put(lower, prism(P, front, bo, bi, Z0 - 1 - h * 0.8, Z0 + 1));
  }

  const sp = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(0.08 + sp.x * reach * 0.92); return m; });
  bag.add(B.unregister);
  function aim(p) {
    const t = p ? clamp((p[0] - 60) / 280, 0, 1) : REST;
    sp.t = t;
    read.textContent = p ? "brake " + Math.round(t * reach * 100) : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "airbrake",
  means: "A glider wing: the pointer's place across the frame pushes the airbrake blades up and down out of their slot across the span.",
  rules: [1, 3, 5, 8],
  range: [0.3, 0.8, 1],
  tour: [[81, 134], [309, 225], [200, 180], null],
  mount,
});
