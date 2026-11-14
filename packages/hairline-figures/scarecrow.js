/**
 * Scarecrow: a straw figure on a pole in a square plot, arms out on a
 * crossbar, a round head under a brimmed hat. The scarecrow turns on its
 * pole to face the pointer, arms swinging round with it. At rest it stands
 * a quarter-turn off, arms bright. The slider is how far it may turn.
 *
 * The pattern: one part turning to face the pointer.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const CX = 40, CY = 40, REST = 35;
const disc = (r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + CX, v: q.v + CY }));
function rot(ring, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: CX + q.u * c - q.v * s, v: CY + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, 0, 0], [80, 80, 0], [80, 0, 0], [0, 80, 0], [CX, CY, 92], [CX - 32, CY - 32, 52], [CX + 32, CY + 32, 52]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(0, 0, 80, 80, 8, 2);
  put(solid(g), prism(P, front, pr, pi, 0, 4));
  // furrows across the plot
  for (let i = 1; i < 5; i++) mk("path", { d: "M" + P(6, i * 16, 4) + "L" + P(74, i * 16, 4), class: "nf lo" }, g);
  put(solid(g), prism(P, front, disc(2.2, 16), disc(1.2, 16), 4, 30));

  const torso = solid(g), arms = solid(g);
  arms.sil.classList.add("hi");
  const legs = rrect(-6, -9, 6, 9, 4, 4), legsI = rrect(-4.6, -7.6, 4.6, 7.6, 3, 4);
  const bar = rrect(-3, -30, 3, 30, 3, 4), barI = rrect(-1.8, -28.8, 1.8, 28.8, 1.8, 4);
  // head, hat: round, they do not show the turn
  const hg = mk("g", {}, g);
  put(solid(hg), prism(P, front, disc(1.6, 12), disc(0.8, 12), 52, 56));
  const head = [];
  for (let i = 0; i <= 6; i++) { const t = (i / 6) * Math.PI; head.push(...ringAt(P, disc(Math.max(0.5, 8 * Math.sin(t)), 24), 56 + 8 - 8 * Math.cos(t))); }
  mk("path", { d: poly(hull(head)), class: "sil" }, hg);
  put(solid(hg), prism(P, front, disc(15, 40), disc(13, 40), 70, 71.5));
  put(solid(hg), prism(P, front, rrect(CX - 7, CY - 7, CX + 7, CY + 7, 6, 6), rrect(CX - 5.8, CY - 5.8, CX + 5.8, CY + 5.8, 5, 6), 71.5, 80));

  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const r = (a * Math.PI) / 180;
    put(torso, prism(P, front, rot(legs, r), rot(legsI, r), 28, 50));
    put(arms, prism(P, front, rot(bar, r), rot(barI, r), 46, 51));
  }
  draw(REST);
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    const [x, y] = unproj(C, p[0], p[1], 0);
    const want = (Math.atan2(y - CY, x - CX) * 180) / Math.PI + 90;
    let d = want - REST;
    d = ((d % 180) + 270) % 180 - 90; // a crossbar looks the same half a turn round
    d = clamp(d, -reach, reach);
    ang.t = REST + d;
    read.textContent = String(Math.round(((REST + d) % 360 + 360) % 360)).padStart(3, "0") + "°";
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "scarecrow",
  means: "A scarecrow on a pole in a field plot turns to face the pointer, its arms swinging round on the crossbar.",
  rules: [1, 3, 5, 8],
  range: [30, 90, 90],
  tour: [[300, 150], [110, 230], [260, 260], null],
  mount,
});
