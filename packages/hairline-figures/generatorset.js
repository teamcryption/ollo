/**
 * Generator: a backup generator on its skid, the engine housing capped by a
 * heavy hood with a fuel cap. The pointer over the set lifts the hood clear
 * to show the cylinder head and its fins; the farther the pointer reaches
 * toward the near end, the higher it lifts. At rest the hood sits just ajar,
 * bright. The slider is the lift.
 *
 * The pattern: one lid lifting (cloche).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, ringAt, poly, hull, spring, stepS, clamp, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BZ = 5, HZ = 36, REST = 5;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-4, -4, 0], [88, 52, 0], [88, -4, 0], [-4, 52, 0], [2, 2, HZ + 44], [84, 46, HZ + 44]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // skid and its two runners
  const [sr, si] = rings(-4, -4, 88, 52, 4, 1.5);
  put(solid(g), prism(P, front, sr, si, 0, BZ));
  // muffler behind, on the far side
  const [mr, mi] = [disc(70, 2, 5), disc(70, 2, 3.5)];
  put(solid(g), prism(P, front, mr, mi, BZ, HZ + 8));
  // engine housing
  const [br, bi] = rings(6, 6, 78, 44, 6, 2);
  put(solid(g), prism(P, front, br, bi, BZ, HZ));
  // cylinder head with fins, seen when the hood lifts
  for (let f = 0; f < 5; f++) {
    const [fr, fi] = rings(22, 14 + f * 4, 62, 16 + f * 4, 1, 0.4);
    put(solid(g), prism(P, front, fr, fi, HZ, HZ + 3.5));
  }
  // control panel on the near face: an outlet and a switch, as dots
  const panel = [P(78, 18, 22), P(78, 32, 22)];
  for (const [i, p] of panel.entries()) { const d = mk("circle", { r: 2.2, class: i ? "dot off" : "dot m" }, g); d.setAttribute("cx", p[0]); d.setAttribute("cy", p[1]); }
  // the hood and its fuel cap
  const hg = mk("g", {}, g);
  const hood = solid(hg), cap = solid(hg);
  const [hr, hi] = rings(3, 3, 81, 47, 8, 2);
  const lift = spring(REST);
  let last = NaN;
  function draw(z) {
    if (z === last) return;
    last = z;
    put(hood, prism(P, front, hr, hi, HZ + z, HZ + z + 6));
    put(cap, prism(P, front, disc(24, 34, 5), disc(24, 34, 3.5), HZ + z + 6, HZ + z + 10));
  }
  draw(REST);
  hood.sil.classList.add("hi");

  const B = register(stage, (dt) => { const m = stepS(lift, dt); draw(lift.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    const over = x > -20 && x < 104 && y > -20 && y < 68;
    if (!over) return leave();
    const t = clamp((x + y + 20) / 150, 0, 1);
    lift.t = 14 + t * reach;
    read.textContent = "lift " + Math.round(lift.t);
    B.wake();
  }
  function leave() { lift.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "generatorset",
  means: "A backup generator on its skid: the pointer lifts the hood off the engine, higher toward the near end, to show the finned head.",
  rules: [1, 3, 5, 8],
  range: [10, 26, 30],
  tour: [[175, 188], [203, 259], [225, 276], null],
  mount,
});
