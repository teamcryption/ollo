/**
 * Unicycle: a one-wheeled cycle with fork, saddle and pedals on a strip of
 * floor. The pointer rolls it along the strip to stand under it, the spokes
 * and cranks turning as it goes. At rest it stands left of centre, its tyre
 * bright. The slider is how far the strip runs.
 *
 * The pattern: one part sliding along a track (spring).
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, spring, stepS, clamp, seg, unproj, disposer, mk, pointer, put, register, solid } = HL;

const R = 34, TW = 4, SZ = 2 * R + 46, REST = -24, LEN = 92;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.55);
  fit(C, [[-LEN - 4, -16, 0], [LEN + 4, 16, 0], [-LEN + 4, 0, SZ + 8], [LEN - 4, 0, SZ + 8]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-LEN - 4, -16, LEN + 4, 16, 8, 2);
  put(solid(g), prism(P, front, fr, fi, -3, 0));
  const tyre = mk("path", { class: "sil hi" }, g), rim = mk("path", { class: "nf lo" }, g), spokes = mk("path", { class: "nf lo" }, g);
  const frame = mk("path", { class: "nf" }, g), seat = solid(g);
  const pos = spring(REST);
  let last = NaN;
  const wheel = (cx, r, y) => { const o = []; for (let i = 0; i < 40; i++) { const a = (i / 40) * 2 * Math.PI; o.push(P(cx + r * Math.cos(a), y, R + r * Math.sin(a))); } return o; };
  function draw() {
    if (pos.x === last) return;
    last = pos.x;
    const cx = pos.x, turn = -cx / R;
    tyre.setAttribute("d", poly(hull(wheel(cx, R, -TW).concat(wheel(cx, R, TW)))));
    rim.setAttribute("d", poly(wheel(cx, R - 4, TW)));
    let d = "";
    for (let k = 0; k < 8; k++) { const a = turn + (k * Math.PI) / 4; d += seg(P(cx, TW, R), P(cx + (R - 4) * Math.cos(a), TW, R + (R - 4) * Math.sin(a))); }
    spokes.setAttribute("d", d);
    const ca = turn + 0.6, k1 = [cx + 15 * Math.cos(ca), 11, R + 15 * Math.sin(ca)], k2 = [cx - 15 * Math.cos(ca), -11, R - 15 * Math.sin(ca)];
    frame.setAttribute("d", seg(P(cx, TW + 2, R), P(cx, TW + 2, SZ - 12)) + seg(P(cx, -TW - 2, R), P(cx, -TW - 2, SZ - 12)) + seg(P(cx, 0, SZ - 12), P(cx, 0, SZ))
      + seg(P(cx, TW + 3, R), P(...k1)) + seg(P(k1[0] - 4, k1[1], k1[2]), P(k1[0] + 4, k1[1], k1[2]))
      + seg(P(cx, -TW - 3, R), P(...k2)) + seg(P(k2[0] - 4, k2[1], k2[2]), P(k2[0] + 4, k2[1], k2[2])));
    const [sr, si] = rings(cx - 13, -6, cx + 11, 6, 5, 1.5);
    put(seat, prism(P, front, sr, si, SZ, SZ + 6));
  }
  const B = register(stage, (dt) => { const m = stepS(pos, dt); draw(); return m; });
  bag.add(B.unregister);
  function aim(t) {
    pos.t = t;
    read.textContent = t === REST ? "rest" : (t > 0 ? "+" : "") + Math.round(t);
    B.wake();
  }
  aim(REST);
  bag.add(pointer(stage, { move: ([sx, sy]) => { const [x] = unproj(C, sx, sy, 0); aim(Math.round(clamp(x, -reach, reach))); }, leave: () => aim(REST) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "unicycle",
  means: "A unicycle on a strip of floor: the pointer rolls it along the strip to stand under it, spokes and pedals turning as it goes.",
  rules: [1, 3, 5, 8],
  range: [30, 56, 56],
  tour: [[255, 271], [139, 213], [200, 240], null],
  mount,
});
