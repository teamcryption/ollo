/**
 * Clipboard: a board with a sheet under a spring clip, lying on a desk mat.
 * The pointer turns the board on the mat to face it; the clip is the bright
 * mark. The slider is how far it may turn.
 */
const { Cam, fit, hull, poly, proj, rrect, unproj, clamp, rad, spring, stepS, disposer, mk, pointer, register, solid, seg } = HL;

const BOARD = rrect(-30, -40, 30, 40, 5, 4), BIN = rrect(-28, -38, 28, 38, 4, 4);
const PAPER = rrect(-25, -31, 25, 36, 1.5, 3), PIN = rrect(-24, -30, 24, 35, 1, 3);
const CLIP = rrect(-13, -39, 13, -27, 3, 4), CIN = rrect(-11, -37, 11, -29, 2, 4);
const LEV = rrect(-8, -37, 8, -24, 3, 4), LIN = rrect(-6.5, -35.5, 6.5, -25.5, 2, 4);
const MAT = rrect(-56, -56, 56, 56, 10, 4), MIN = rrect(-54, -54, 54, 54, 9, 4);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-56, -56, -3], [56, 56, -3], [56, -56, 0], [-56, 56, 0], [0, 0, 10]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const lift = (r, z, a) => r.map((q) => { const c = Math.cos(a), s = Math.sin(a); return P(q.u * c - q.v * s, q.u * s + q.v * c, z); });
  const mat = solid(g);
  mat.sil.setAttribute("d", poly(hull(lift(MAT, -3, 0).concat(lift(MAT, 0, 0)))));
  mat.cr.setAttribute("d", poly(lift(MIN, 0, 0)));
  const parts = [[BOARD, BIN, 0, 2.4], [PAPER, PIN, 2.4, 3], [CLIP, CIN, 3, 6.5], [LEV, LIN, 6.5, 8.5]].map((p) => ({ p, s: solid(g) }));
  const lines = mk("path", { class: "lo nf" }, g);
  parts[2].s.sil.classList.add("hi");
  parts[3].s.sil.classList.add("hi");
  const REST = -16, ang = spring(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg);
    for (const { p: [r, i, z0, z1], s } of parts) {
      s.sil.setAttribute("d", poly(hull(lift(r, z0, a).concat(lift(r, z1, a)))));
      s.cr.setAttribute("d", poly(lift(i, z1, a)));
    }
    const rot = (x, y) => { const c = Math.cos(a), s = Math.sin(a); return P(x * c - y * s, x * s + y * c, 3); };
    let d = "";
    for (let y = -16; y <= 28; y += 8) d += seg(rot(-18, y), rot(y > 20 ? 4 : 18, y));
    lines.setAttribute("d", d);
    // move the lines under the clip in paint order
    parts[2].s.g.before(lines);
  }
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  function aim(deg) { ang.t = deg; read.textContent = deg === REST ? "rest" : Math.round(deg) + "°"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, 0); aim(clamp(((x - y) / 90) * reach, -reach, reach)); },
    leave: () => aim(REST),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "clipboard2",
  means: "A clipboard with a sheet under its clip, lying on a desk mat: the board turns on the mat to face the pointer.",
  rules: [1, 3, 5, 8],
  range: [20, 50, 70],
  tour: [[310, 155], [46, 155], [354, 155], null],
  mount,
});
