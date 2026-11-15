/**
 * Check stamp: an endorsement stamp over a paper check on the desk. The
 * stamp slides to the spot under the pointer and presses down onto the
 * check; leaving lifts it back to its corner. At rest it hangs raised over
 * the check's right end, bright. The slider is how hard it presses.
 */
const {
  Cam, circ, clamp, fit, facing, poly, prism, proj, rings, unproj, spring, stepS, seg,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 120, D = 56, PZ = 1.6, REST = [96, 30, 22];
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let press = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [REST[0], REST[1], REST[2] + 34], [16, 12, 40]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(0, 0, W, D, 3, 1.2);
  put(solid(g), prism(P, front, cr, ci, 0, PZ));
  // the check's own marks: payee line, amount box, signature line, perforation
  mk("path", { class: "lo nf", d: seg(P(12, 22, PZ), P(78, 22, PZ)) + seg(P(12, 44, PZ), P(60, 44, PZ)) }, g);
  mk("path", { class: "lo nf", d: poly([P(86, 14, PZ), P(110, 14, PZ), P(110, 26, PZ), P(86, 26, PZ)]) }, g);
  mk("path", { class: "dash", d: seg(P(6, 4, PZ), P(6, D - 4, PZ)) }, g);

  const sg = mk("g", {}, g), pad = solid(sg), neck = solid(sg), knob = solid(sg);
  const sx = spring(REST[0]), sy = spring(REST[1]), sz = spring(REST[2]);
  let last = "";
  function draw() {
    const x = sx.x, y = sy.x, z = sz.x, key = [x, y, z].map((v) => v.toFixed(2)).join();
    if (key === last) return;
    last = key;
    const [pr, pi] = rings(x - 17, y - 10, x + 17, y + 10, 3, 1.4);
    put(pad, prism(P, front, pr, pi, z, z + 9));
    put(neck, prism(P, front, disc(x, y, 4), disc(x, y, 3), z + 9, z + 22));
    put(knob, prism(P, front, disc(x, y, 9), disc(x, y, 7.4), z + 22, z + 31));
  }

  const B = register(stage, (dt) => {
    const m = [stepS(sx, dt), stepS(sy, dt), stepS(sz, dt)].some(Boolean);
    draw();
    return m;
  });
  bag.add(B.unregister);

  function aim(p) {
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], 0);
      const on = wx > -10 && wx < W + 10 && wy > -10 && wy < D + 10;
      sx.t = clamp(wx, 17, W - 17); sy.t = clamp(wy, 10, D - 10); sz.t = on ? PZ + 14 * (1 - press) : REST[2];
      read.textContent = on ? "press " + Math.round(sx.t / 20) + "·" + Math.round(sy.t / 20) : "rest";
      pad.sil.classList.toggle("hi", true);
    } else {
      sx.t = REST[0]; sy.t = REST[1]; sz.t = REST[2];
      read.textContent = "rest";
      pad.sil.classList.toggle("hi", true);
    }
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { press = v; }, destroy: bag.dispose };
}

hairline({
  name: "abacus2",
  means: "An endorsement stamp over a paper check: it slides to the spot under the pointer and presses down onto the check.",
  rules: [1, 3, 5, 8],
  range: [0, 0.8, 1],
  tour: [[150, 135], [139, 172], [245, 250], null],
  mount,
});
