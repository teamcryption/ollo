/**
 * Bread board: a thick wooden board with a hanging hole, a long bread knife
 * lying across it. The pointer over the board swings the knife round on its
 * handle and lifts the blade off the wood, ready to cut. At rest the knife
 * lies a little askew, its blade bright. The slider is how far it swings.
 *
 * The pattern: one part turning about a fixed pivot.
 */
const { Cam, fit, facing, hull, poly, prism, proj, rad, rings, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const BZ = 6, PV = [-30, 14];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-46, -30, 0], [46, 30, 0], [-46, 30, 0], [46, -30, 0], [40, -40, 24], [10, -56, 20], [-30, 14, 20]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [br, bi] = rings(-46, -30, 46, 30, 10, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const hole = [];
  for (let i = 0; i < 20; i++) { const t = (i / 20) * 2 * Math.PI; hole.push(P(-38 + 3 * Math.cos(t), -20 + 3 * Math.sin(t), BZ)); }
  mk("path", { d: poly(hole), class: "nf lo" }, g);

  const kg = mk("g", {}, g);
  const handle = solid(kg), blade = solid(kg);
  blade.sil.classList.add("hi");
  const HAND = [[-16, -3], [8, -3.6], [8, 3.6], [-16, 3], [-18, 0]];
  const BL = [[8, -4.6], [74, -4.6], [80, -2], [80, 1.2], [8, 4.6]];

  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = rad(-24 - 40 * amp * t), ca = Math.cos(a), sa = Math.sin(a), lift = 14 * t;
    // knife plan rotated about the pivot; the blade tips up as it lifts
    const K = ([u, v], z) => P(PV[0] + u * ca - v * sa, PV[1] + u * sa + v * ca, BZ + z + lift * Math.max(0, u) / 80);
    const S = (pl, z0, z1) => poly(hull(pl.map((p) => K(p, z0)).concat(pl.map((p) => K(p, z1)))));
    handle.sil.setAttribute("d", S(HAND, 0, 6));
    handle.cr.setAttribute("d", poly([K([-14, 0], 6), K([6, 0], 6)]));
    blade.sil.setAttribute("d", S(BL, 0, 1.2));
    blade.cr.setAttribute("d", poly([K([10, 3.4], 1.2), K([76, 0.6], 1.2)]));
  }
  const tw = tween(0);
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, BZ);
  let on = null;
  function set(v) {
    if (v === on) return;
    on = v;
    tset(tw, v ? 1 : 0, performance.now(), 0);
    read.textContent = v ? "cut" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => set(Math.abs(sx - mid[0]) < 140 && Math.abs(sy - mid[1]) < 90), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "breadboard",
  means: "A bread board with a long knife across it: the pointer swings the knife round on its handle and lifts the blade to cut.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1],
  tour: [[196, 163], [110, 152], [300, 176], null],
  mount,
});
