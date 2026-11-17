/**
 * Valet tag: a valet's paper key tag with a punched eyelet and a tear-off
 * stub, hung by its string from the peg of a desk stand. The pointer swings
 * it on the peg, the tag kicking out to one side. At rest it hangs with a
 * slight lean, bright. The slider is how far it swings.
 *
 * The pattern: one part swinging on the discrete clock; hit on the ground.
 */
const {
  Cam, circ, clamp, fillet, fit, facing, hull, poly, prism, proj, rings, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PY = -22, PZ = 118, TY = 10, SL = 10, REST = 0.14, MAXA = 0.95;
const SHAPE = fillet([[-11, 0], [11, 0], [21, -12], [21, -78], [-21, -78], [-21, -12]], [2, 2, 3, 3, 3, 3], 4);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-34, -34, 0], [34, 34, 0], [34, -34, 0], [-34, 34, 0], [0, PY, PZ + 6], [-70, TY, PZ - 50], [70, TY, PZ - 50], [0, TY, PZ - SL - 80]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(30, 44), circ(28, 44), 0, 5));
  const [pr, pi] = rings(-3, PY - 3, 3, PY + 3, 3, 1);
  put(solid(g), prism(P, front, pr, pi, 5, PZ + 4));
  const [ar, ai] = rings(-2, PY, 2, TY + 6, 2, 0.8);
  put(solid(g), prism(P, front, ar, ai, PZ - 2, PZ + 2));
  const str = mk("path", { class: "nf lo" }, g), tag = mk("path", { class: "sil hi" }, g);
  const eye = mk("path", { class: "nf lo" }, g), perf = mk("path", { class: "nf lo" }, g);
  const A = tween(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a), top = PZ - 2;
    const q = (u, w, y = TY) => { const ww = w - SL; return P(u * c - ww * s, y, top + u * s + ww * c); };
    const pts = [];
    for (const y of [TY - 1, TY + 1]) for (const [u, w] of SHAPE) pts.push(q(u, w, y));
    tag.setAttribute("d", poly(hull(pts)));
    eye.setAttribute("d", poly(circ(3.2, 16).map((o) => q(o.u, -7 + o.v, TY + 1))));
    let d = "";
    for (let u = -19; u < 19; u += 4) d += seg(q(u, -56, TY + 1), q(u + 2, -56, TY + 1));
    perf.setAttribute("d", d);
    str.setAttribute("d", seg(P(0, TY, top), q(-2, -7, TY)) + seg(P(0, TY, top), q(2, -7, TY)));
  }

  const B = register(stage, (_dt, now) => { draw(tval(A, now)); return !tdone(A, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    const k = v ? 1 : 0;
    if (k === on) return;
    on = k;
    const a = k ? -MAXA * clamp(reach, 0.15, 1) : REST;
    tset(A, a, performance.now(), 0);
    read.textContent = k ? "swing " + Math.round((-a * 180) / Math.PI) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 40); setOn(Math.abs(x) < 70 && Math.abs(y - TY) < 70); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "roomsign",
  means: "A valet key tag with an eyelet and tear-off stub, hung on a desk peg: the pointer swings it out to one side.",
  rules: [1, 3, 5, 8],
  range: [0.2, 1, 1],
  tour: [[194, 139], [175, 120], [217, 206], null],
  mount,
});
