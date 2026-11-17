/**
 * Smoke alarm: a round alarm on its mounting plate, hinged at one side. The
 * pointer swings it open: the further along the plate it goes, the wider the
 * cover tips up on its hinge, showing the battery and test button beneath.
 * At rest it sits shut, its test button bright. The slider is the widest swing.
 *
 * The pattern: one part swinging on a hinge (lid).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, rad, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 24, H = -R, Z0 = 4, BH = 9, MAXA = 78;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let wide = value;
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-30, -30, 0], [30, 30, 0], [30, -30, 0], [-30, 30, 0], [H, 0, Z0 + 2 * R + 2], [H + 6, R, Z0 + 2 * R]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-30, -30, 30, 30, 10, 2);
  put(solid(g), prism(P, front, br, bi, 0, Z0));
  const [cr, ci] = rings(-6, -14, 10, 14, 3, 1.2);
  put(solid(g), prism(P, front, cr, ci, Z0, Z0 + 6));
  const [tr, ti] = rings(14, -4, 20, 4, 3, 1);
  put(solid(g), prism(P, front, tr, ti, Z0, Z0 + 2));

  const body = mk("path", { class: "sil" }, g), face = mk("path", { class: "nf lo" }, g), btn = mk("path", {}, g);
  const ring = circ(R, 48), small = (r) => circ(r, 32);
  let A = NaN;
  function draw(a) {
    if (a === A) return;
    A = a;
    const ca = Math.cos(rad(a)), sa = Math.sin(rad(a));
    const T = (x, y, z) => P(H + (x - H) * ca - (z - Z0) * sa, y, Z0 + (x - H) * sa + (z - Z0) * ca);
    const at = (rg, z, s = 1) => rg.map((q) => T(q.u * s, q.v * s, z));
    body.setAttribute("d", poly(hull(at(ring, Z0 + 0.5).concat(at(ring, Z0 + BH - 2), at(ring, Z0 + BH, 0.8)))));
    let d = "";
    if (a < 40) for (const s of [0.64, 0.76]) d += poly(at(ring, Z0 + BH - 0.3, s));
    else d += poly(at(ring, Z0 + 0.5, 0.88));
    face.setAttribute("d", d);
    btn.setAttribute("d", a < 40 ? poly(hull(at(small(4), Z0 + BH).concat(at(small(4), Z0 + BH + 1.6)))) : "");
  }
  const sp = spring(0, { k: 80, c: 15 });
  const B = register(stage, (dt) => { const mv = stepS(sp, dt); draw(sp.x); return mv; });
  bag.add(B.unregister);

  function aim(x) {
    const a = x == null ? 0 : clamp((x - H + 6) / (2 * R), 0.1, 1) * MAXA * wide;
    sp.t = a;
    btn.classList.toggle("hi", a === 0);
    read.textContent = a === 0 ? "rest" : Math.round(a) + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: ([sx, sy]) => aim(unproj(C, sx, sy, Z0)[0]), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { wide = v; }, destroy: bag.dispose };
}

hairline({
  name: "smokealarm",
  means: "A smoke alarm on its mounting plate: the pointer swings the cover up on its hinge to show the battery beneath.",
  rules: [1, 3, 5, 6],
  range: [0.4, 1, 1],
  tour: [[195, 203], [247, 228], [256, 233], null],
  mount,
});
