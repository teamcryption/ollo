/**
 * Horsetrough: a stone horse trough with a cast hand pump at its far end.
 * Over the trough, the long pump handle swings down, water runs from the
 * spout, and the waterline inside rises. At rest the handle stands raised,
 * bright, and the trough is low.
 * The slider is how far the handle swings.
 *
 * The pattern: one discrete choice (over it or not) on the 700ms tween; the
 * hit is a fixed plane through the trough, which never moves.
 */
const {
  Cam, circ, fillet, fit, facing, hull, open, poly, prism, proj, rings, ringAt, rrect, run, seg, unproj, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = -48, CT = 74, L = 66, TH = 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.75);
  let amp = value;
  const piv = [PX, 0, CT + 4];
  fit(C, [[-30, -20, 0], [36, 20, 0], [36, -20, 0], [-30, 20, 0], [PX - L * 0.8, 0, CT + 4 + L * 0.6], [PX - L * 0.8, 0, CT - L * 0.6], [PX, 8, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the pump column, far end
  const col = solid(g), cr = circ(5.5, 24).map((q) => ({ ...q, u: q.u + PX, v: q.v }));
  put(col, prism(P, front, cr, circ(4.5, 24).map((q) => ({ ...q, u: q.u + PX, v: q.v })), 0, CT));
  const cap = solid(g), capr = circ(7, 24).map((q) => ({ ...q, u: q.u + PX, v: q.v }));
  put(cap, prism(P, front, capr, circ(5.6, 24).map((q) => ({ ...q, u: q.u + PX, v: q.v })), CT, CT + 4));
  // the trough, open at the top
  const [tr, ti] = rings(-30, -19, 36, 19, 5, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TH));
  const [inr] = rings(-26, -15, 32, 15, 3, 1);
  mk("path", { class: "nf lo", d: poly(ringAt(P, inr, TH)) }, g);
  const water = mk("path", { class: "nf lo" }, g);
  const [sr, si] = rings(PX, -3, -22, 3, 2, 0.8);
  put(solid(g), prism(P, front, sr, si, 56, 62));
  const stream = mk("path", { class: "nf sil" }, g), splash = mk("path", { class: "nf lo" }, g);
  const handle = mk("path", { class: "sil hi" }, g);
  const back = run(rrect(-26, -15, 32, 15, 3, 4), (q) => !front(q));
  const sw = tween(0);
  let last = "";

  function draw(now) {
    const t = tval(sw, now), a = (0.6 - t * 1.25 * amp) ;
    const key = a.toFixed(3);
    if (key === last) return;
    last = key;
    const e = [piv[0] - L * Math.cos(a), 0, piv[2] + L * Math.sin(a)];
    const nx = Math.sin(a) * 2.2, nz = Math.cos(a) * 2.2, s0 = [piv[0] + 6 * Math.cos(a), 0, piv[2] - 6 * Math.sin(a)];
    const pts = [P(s0[0] - nx, 0, s0[2] - nz), P(e[0] - nx, 0, e[2] - nz), P(e[0] + nx, 0, e[2] + nz), P(s0[0] + nx, 0, s0[2] + nz)];
    handle.setAttribute("d", poly(fillet(pts, [2, 2, 2, 2], 3)));
    const wz = TH - 14 + 10 * t;
    water.setAttribute("d", open(back.map((q) => P(q.u, q.v, wz))));
    stream.setAttribute("d", t > 0.05 ? seg(P(-23, 0, 56), P(-23, 0, wz)) : "");
    splash.setAttribute("d", t > 0.05 ? poly(circ(3 + 5 * t, 20).map((q) => P(-23 + q.u, q.v, wz))) : "");
  }

  const B = register(stage, (dt, now) => { draw(now); return !tdone(sw, now); });
  bag.add(B.unregister);

  function set(on) {
    tset(sw, on ? 1 : 0, performance.now(), 0);
    read.textContent = on ? "pump" : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 20); set(x > -70 && x < 44 && Math.abs(y) < 30); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  set(false);
  return { set: (v) => { amp = v; last = ""; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "horsetrough",
  means: "A horse trough with a hand pump: over it, the long handle swings down, water runs and the waterline rises.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1.2],
  tour: [[228, 239], [196, 214], [256, 252], null],
  mount,
});
