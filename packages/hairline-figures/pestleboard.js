/**
 * Mezzaluna: a crescent chopping blade with a handle standing at each end,
 * resting on a round-cornered board. The blade rolls on its curved edge:
 * the pointer's place along the board rocks it toward that end, the curve
 * rolling so the edge always meets the board. At rest it leans a little to
 * one side, its blade bright. The slider is how far it rocks.
 *
 * The pattern: one part following the pointer (spring), hit on a fixed plane.
 */
const {
  Cam, clamp, fillet, fit, facing, hull, poly, prism, proj, rings, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 46, BZ = 5, T = 1.4, HT = 3.6, REST = 0.16;
const BX0 = -60, BX1 = 60, BY0 = -26, BY1 = 26;
// the blade in its own plane (u along the board, w up), bottom on a circle of radius R
const blade = [];
for (let i = 0; i <= 16; i++) { const u = -34 + (68 * i) / 16; blade.push([u, R - Math.sqrt(R * R - u * u)]); }
for (let i = 16; i >= 0; i--) { const u = -34 + (68 * i) / 16; blade.push([u, 24 - (1156 - u * u) * 0.0085]); }
const post = (c) => fillet([[c - 3.4, 18], [c + 3.4, 18], [c + 4.6, 50], [c - 4.6, 50]], [1, 1, 3, 3], 4);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[BX0, BY0, 0], [BX1, BY1, 0], [BX1, BY0, 0], [BX0, BY1, 0], [-40, 0, BZ + 52], [40, 0, BZ + 52]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(BX0, BY0, BX1, BY1, 10, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));

  const farB = mk("path", { class: "lo" }, g);
  const nearB = mk("path", { class: "sil hi" }, g), edge = mk("path", { class: "nf lo" }, g);
  const hand = [mk("path", { class: "sil" }, g), mk("path", { class: "sil" }, g)];
  const th = spring(REST);
  let last = NaN;

  // roll: the arc's centre slides R·θ along the board, the shape turns θ about it
  function at(th, u, w, y) {
    const cu = -R * th, du = u, dw = w - R, c = Math.cos(th), s = Math.sin(th);
    return P(cu + du * c - dw * s, y, BZ + R + du * s + dw * c);
  }
  function draw(t) {
    if (t === last) return;
    last = t;
    const face = (pts, y) => pts.map(([u, w]) => at(t, u, w, y));
    farB.setAttribute("d", poly(face(blade, -T)));
    nearB.setAttribute("d", poly(face(blade, T)));
    edge.setAttribute("d", poly(face(blade.slice(0, 17).concat(blade.slice(0, 17).reverse().map(([u, w]) => [u, w + 1.6])), T)));
    [-30, 30].forEach((c, i) => hand[i].setAttribute("d", poly(hull(face(post(c), -HT).concat(face(post(c), HT))))));
  }

  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(th.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, BZ);
    if (x < BX0 - 4 || x > BX1 + 4 || y < BY0 - 30 || y > BY1 + 6) return leave();
    const f = clamp(x / 44, -1, 1);
    th.t = -f * reach;
    read.textContent = f < -0.25 ? "left" : f > 0.25 ? "right" : "mid";
    B.wake();
  }
  function leave() { th.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "pestleboard",
  means: "A mezzaluna on a chopping board: the curved blade rolls toward the end of the board under the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.2, 0.42, 0.55],
  tour: [[110, 190], [265, 231], [200, 205], null],
  mount,
});
