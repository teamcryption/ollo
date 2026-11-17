/**
 * Pocket door: a length of wall with a doorway in it and a door that slides
 * sideways into a pocket hidden inside the wall. The pointer near the
 * doorway slides the door into the pocket on a spring, further the closer
 * it comes, leaving only its edge and pull showing. At rest the door stands
 * nearly shut, bright. The slider is how far it can slide.
 *
 * The pattern: a continuous slide, hit on a fixed plane (unproj).
 */
const {
  Cam, clamp, fit, hull, poly, proj, prism, rings, rrect, seg, unproj, spring, stepS,
  disposer, facing, mk, pointer, put, register, solid,
} = HL;

const X0 = -46, OW = 42, X1 = OW + 12, T = 5, WH = 80, DH = 68, REST = 5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[X0, -T, 0], [X1, T, 0], [X0, -T, WH], [X1, T, WH], [X0, 8, 0], [X1, 8, 0]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, z0, z1) => { const [r, i] = rings(x0, y0, x1, y1, 2, 1.2); put(solid(g), prism(P, front, r, i, z0, z1)); };
  // floor strip, the wall that holds the pocket, the door, the far jamb and the header
  block(-2, -T - 3, OW + 2, T + 3, -2, 0);
  block(X0, -T, 0, T, 0, WH);
  const sil = mk("path", { class: "sil hi" }, g), cr = mk("path", { class: "nf lo" }, g), pull = mk("path", { class: "nf" }, g);
  block(OW, -T, X1, T, 0, WH);
  block(-1, -T, OW + 1, T, DH + 2, WH);

  const sl = spring(REST);
  let last = NaN;
  function draw() {
    if (sl.x === last) return;
    last = sl.x;
    const a = Math.max(0.6, -sl.x), b = OW - sl.x, t = 1.6, pts = [];
    for (const q of rrect(a, -t, b, t, 1.2, 3)) pts.push(P(q.u, q.v, 0.5), P(q.u, q.v, DH + 1.5));
    sil.setAttribute("d", poly(hull(pts)));
    cr.setAttribute("d", poly(rrect(Math.max(a, b - OW + 3), 2, b - 3, DH - 2, 2, 3).map((q) => P(q.u, t, q.v))));
    pull.setAttribute("d", poly(rrect(b - 7, 30, b - 4, 42, 1.5, 3).map((q) => P(q.u, t + 0.2, q.v))));
  }
  const B = register(stage, (dt) => { const m = stepS(sl, dt); draw(); return m; });
  bag.add(B.unregister);
  function aim(p) {
    let d = Infinity;
    if (p) { const [x, y] = unproj(C, p[0], p[1], DH / 2); d = Math.hypot(x - OW / 2, y); }
    const on = d < 70;
    sl.t = on ? clamp(1 - d / 70, 0.25, 1) * 34 * reach + 4 : REST;
    read.textContent = on ? "open " + Math.round(sl.t / OW * 100) + "%" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "pocketdoor",
  means: "A pocket door: it slides sideways into a hidden pocket in the wall as the pointer comes near, further the closer it is.",
  rules: [1, 3, 5, 8],
  range: [0.4, 0.85, 1],
  tour: [[242, 193], [300, 235], [215, 175], null],
  mount,
});
