/**
 * Launch couch: a capsule seat on a strut frame, with a backrest and a leg
 * rest hinged to the pan. The pointer sets the recline: toward the back of the
 * pad the couch lies down for launch, toward the front it sits up, on a spring.
 * At rest it is half back, harness buckle lit.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rrect, seg, unproj, spring, stepS, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 18, Z0 = 26, BL = 54, LL = 30, T = 5;
const REST = 0.75;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-62, -W, 0], [48, W, 0], [-10, W, Z0 + BL], [48, -W, 0], [-62, W, Z0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-26, -26, 30, 26, 8, 2);
  put(solid(g), prism(P, front, br, bi, -5, 0));
  const legs = mk("path", { class: "nf sil" }, g);
  legs.setAttribute("d", [[-6, -12], [16, -12], [-6, 12], [16, 12]].map(([x, y]) => seg(P(x, y, 0), P(x, y, Z0 - 1))).join(""));
  const back = solid(g);
  const [sr, si] = rings(-10, -W, 22, W, 6, 1.6);
  put(solid(g), prism(P, front, sr, si, Z0 - T, Z0));
  const buckle = mk("circle", { class: "dot", r: 2.8 }, g);
  const bp = P(8, 0, Z0 + 0.4); buckle.setAttribute("cx", bp[0]); buckle.setAttribute("cy", bp[1]);
  const leg = solid(g);
  const th = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = "", over = false;

  /** A plate hinged at h, running len along a, with thickness along n. */
  function plate(s, h, a, n, len, w) {
    const ring = rrect(0, -w, len, w, 6, 4), inner = rrect(1.6, -w + 1.6, len - 1.6, w - 1.6, 4.4, 4);
    const at = (r, t) => r.map((q) => P(h[0] + a[0] * q.u + n[0] * t, h[1] + q.v, h[2] + a[2] * q.u + n[2] * t));
    s.sil.setAttribute("d", poly(hull(at(ring, 0).concat(at(ring, T)))));
    s.cr.setAttribute("d", poly(at(inner, T)));
    s.cr.setAttribute("class", "nf lo");
  }

  function draw() {
    const key = th.x.toFixed(3);
    if (key === last) return; last = key;
    const t = th.x;
    plate(back, [-10, 0, Z0 - T], [-Math.sin(t), 0, Math.cos(t)], [Math.cos(t), 0, Math.sin(t)], BL, W);
    const l = 0.35 + (1.4 - t) * 0.9;
    plate(leg, [22, 0, Z0 - T], [Math.cos(l), 0, -Math.sin(l)], [Math.sin(l), 0, Math.cos(l)], LL, W - 2);
  }

  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(); return m; });
  bag.add(B.unregister);

  function set(p) {
    over = !!p;
    th.t = p ? clamp(0.75 - p[0] / 80, 0.12, 1.35) : REST;
    back.sil.classList.toggle("hi", over);
    buckle.setAttribute("class", over ? "dot off" : "dot");
    read.textContent = over ? `${Math.round(th.t * 57.3)}°` : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); set(Math.abs(x) > 90 || Math.abs(y) > 70 ? null : [x, y]); },
    leave: () => set(null),
  }));
  bag.add(() => svg.replaceChildren());
  set(null);
  return { set: (v) => { th.k = 100 * v; th.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "astronautseat",
  means: "A capsule launch couch on its frame: the pointer sets the recline, lying back toward the pad's rear and sitting up toward its front.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[139, 174], [295, 252], [54, 174], null],
  mount,
});
