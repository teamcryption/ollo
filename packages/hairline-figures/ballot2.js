/**
 * Petition box: a boxed ballot with a hinged lid and a sign on a post. The
 * pointer's nearness swings the lid open on its back hinge (a spring), so the
 * box opens toward a hand reaching for it. At rest the lid sits ajar.
 */
const {
  Cam, facing, fit, prism, proj, rings, rrect, hull, poly, open, unproj, clamp, rad,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = -30, X1 = 30, Y0 = -22, Y1 = 22, H = 40, D = 46, TH = 3, REST = 9;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.45);
  let MAX = 78 * value;
  fit(C, [[X0, Y0, 0], [X1, Y1, 0], [X1, Y0, H + D], [X0, Y0, H + D], [56, 20, 54], [X0, Y1, 0]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [ring, inner] = rings(X0, Y0, X1, Y1, 4, 1.6);
  put(solid(g), prism(P, front, ring, inner, 0, H));
  const slot = rings(-14, -2, 14, 2, 1.5, 0.5)[0];
  mk("path", { class: "lo nf", d: poly(slot.map((q) => P(q.u, q.v, H))) }, g);

  const lid = solid(g);
  const LR = rrect(X0 - 2, 0, X1 + 2, D, 4, 4), LI = rrect(X0 + 1, 3, X1 - 1, D - 3, 2.5, 4);
  const LS = rrect(-14, D / 2 - 2, 14, D / 2 + 2, 1.5, 3);
  const slotLid = mk("path", { class: "lo nf", d: "" }, g);
  const sp = spring(rad(REST));
  let drawn = NaN;
  const pt = (q, a, w) => {
    const c = Math.cos(a), s = Math.sin(a);
    return P(q.u, Y0 - 2 + q.v * c - w * s, H + q.v * s + w * c);
  };
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const pts = LR.map((q) => pt(q, a, 0)).concat(LR.map((q) => pt(q, a, TH)));
    put(lid, { sil: poly(hull(pts)), crease: poly(LI.map((q) => pt(q, a, TH))) });
    slotLid.setAttribute("d", poly(LS.map((q) => pt(q, a, TH))));
  }

  const sign = mk("g", {}, svg);
  const post = rings(45, 17.5, 47, 19.5, 0.8, 0.3), plate = rings(37, 17, 55, 20, 1.2, 0.6);
  put(solid(sign), prism(P, front, post[0], null, 0, 34));
  const pl = solid(sign);
  put(pl, prism(P, front, plate[0], plate[1], 32, 54));

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function set(open01) {
    sp.t = rad(open01 == null ? REST : REST + (MAX - REST) * open01);
    lid.sil.classList.toggle("hi", true);
    read.textContent = open01 == null ? "rest" : "lid " + Math.round((sp.t * 180) / Math.PI) + "°";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), d = Math.hypot(x, y);
      set(d > 95 ? null : clamp(1 - (d - 20) / 60, 0, 1));
    },
    leave: () => set(null),
  }));
  bag.add(() => svg.replaceChildren());
  set(null);
  draw();
  return { set: (v) => { MAX = 78 * v; }, destroy: bag.dispose };
}

hairline({
  name: "ballot2",
  means: "A petition box with a sign on a post: the hinged lid swings open as the pointer comes near.",
  rules: [1, 3, 5, 8],
  range: [0.6, 1, 1.2],
  tour: [[113, 227], [200, 253], [183, 297], null],
  mount,
});
