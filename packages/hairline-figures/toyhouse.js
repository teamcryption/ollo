/**
 * Doll house: a gabled toy house whose front is two hinged halves. The
 * pointer over the house swings both halves open to show the rooms and the
 * stair inside. At rest the front stands just ajar, bright. The slider is
 * how far the front swings.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, rad,
} = HL;

const W = 80, D = 46, H = 56, R = 26, T = 2.5, REST = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-4, -4, 0], [W + 4, D + W / 2 + 4, 0], [W + 4, -4, H + R], [-4, D + W / 2, 0], [-4, -4, H + R]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [r0, r1] = rings(0, 0, W, D, 2, 1);
  put(solid(g), prism(P, front, r0, r1, 0, H));
  const roofPts = [];
  for (const x of [-4, W + 4]) roofPts.push([x, -5, H], [x, D + 5, H], [x, D / 2, H + R]);
  mk("path", { d: poly(hull(roofPts.map((p) => P(...p)))), class: "sil" }, g);
  mk("path", { d: poly([P(W + 4, -5, H), P(W + 4, D + 5, H), P(W + 4, D / 2, H + R)]) + seg(P(-4, D / 2, H + R), P(W + 4, D / 2, H + R)), class: "nf lo" }, g);
  // the rooms: a floor, a wall, a stair
  const st = [];
  for (let i = 0; i < 5; i++) st.push([46 + i * 6, D, i * 5.6], [52 + i * 6, D, i * 5.6]);
  mk("path", {
    d: seg(P(0, D, H / 2), P(W, D, H / 2)) + seg(P(W / 2, D, 0), P(W / 2, D, H)) + open(st.map((p) => P(...p))) +
      poly([P(8, D, 0), P(30, D, 0), P(30, D, 8), P(8, D, 8)]) + poly([P(10, D, H / 2 + 10), P(28, D, H / 2 + 10), P(28, D, H / 2 + 22), P(10, D, H / 2 + 22)]),
    class: "nf lo",
  }, g);
  const halves = [0, 1].map((k) => ({ k, sil: mk("path", { class: "sil" }, g), det: mk("path", { class: "nf" }, g) }));
  // hinge at x = 0 (left half) or x = W (right half), swinging out toward +y
  const at = (k, a) => (s, h, w) => {
    const sg = k ? -1 : 1, x0 = k ? W : 0;
    return P(x0 + sg * (s * Math.cos(a) - w * Math.sin(a)), D + s * Math.sin(a) + w * Math.cos(a), h);
  };
  const ang = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    for (const hv of halves) {
      const f = at(hv.k, rad(deg)), pts = [];
      for (const s of [0, W / 2]) for (const h of [0, H]) for (const w of [0, T]) pts.push(f(s, h, w));
      hv.sil.setAttribute("d", poly(hull(pts)));
      const win = (s0, s1, h0, h1) => poly([f(s0, h0, T), f(s1, h0, T), f(s1, h1, T), f(s0, h1, T)]);
      hv.det.setAttribute("d", hv.k ? win(8, 20, 34, 46) + win(8, 20, 10, 22) + win(24, 32, 34, 46) : win(10, 22, 0, 22) + win(10, 30, 34, 46));
    }
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const sp = [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, 0, H + R], [W, D, H]].map((p) => P(...p));
  const bx = [Math.min(...sp.map((p) => p[0])), Math.max(...sp.map((p) => p[0])), Math.min(...sp.map((p) => p[1])), Math.max(...sp.map((p) => p[1]))];
  const inside = ([sx, sy]) => sx > bx[0] && sx < bx[1] && sy > bx[2] && sy < bx[3];
  let on = null;
  function setOn(o) {
    if (o === on) return;
    on = o;
    tset(ang, o ? maxA : REST, performance.now(), 0);
    halves.forEach((hv) => hv.sil.classList.add("hi"));
    read.textContent = o ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inside(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (on) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "toyhouse",
  means: "A doll house: the pointer over it swings the two halves of its front open to show the rooms and the stair.",
  rules: [1, 3, 4, 5],
  range: [45, 80, 95],
  tour: [[188, 183], [201, 172], [247, 164], null],
  mount,
});
