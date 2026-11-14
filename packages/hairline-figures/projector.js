/**
 * Projector: a projector on the floor and a screen on its stand behind it.
 * The projector turns on its feet to aim where the pointer is along the
 * screen, and the lit frame slides across the screen with it, a dashed beam
 * running from the lens. At rest it sits a little askew, its frame lit off
 * centre. The slider is how far it may swing.
 *
 * The pattern: a part turning to face the pointer; the hit is a fixed plane
 * through the screen's middle, read on a spring.
 */
const { Cam, clamp, facing, fit, hull, open, poly, prism, proj, rad, rings, ringAt, seg, spring, stepS, unproj, disposer, mk, pointer, put, register, solid } = HL;

const CX = 0, CY = 26, D = CY + 30, REST = -9, SZ = [14, 38], SW = 11;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-34, -34, 0], [34, -34, 52], [-34, -34, 52], [34, -30, 0], [-14, 40, 0], [14, 40, 0], [14, 14, 12]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the screen: a thin plate on two legs, facing the projector
  const [sr, si] = rings(-32, -33, 32, -30, 1.2, 0.5);
  mk("path", { class: "nf lo", d: seg(P(-26, -31.5, 0), P(-26, -31.5, 10)) + seg(P(26, -31.5, 0), P(26, -31.5, 10)) + seg(P(-30, -28, 0), P(-22, -35, 0)) + seg(P(22, -35, 0), P(30, -28, 0)) }, g);
  put(solid(g), prism(P, front, sr, si, 10, 50));
  const beam = mk("path", { class: "nf dash" }, g);
  const spot = mk("path", { class: "nf hi" }, g);
  const lens = { sil: mk("path", { class: "sil" }, g), cr: mk("path", { class: "nf lo" }, g) };
  const body = solid(g), foot = mk("path", { class: "nf lo" }, g);

  const rot = (a) => {
    const c = Math.cos(a), s = Math.sin(a);
    return (u, v) => [CX + (u - CX) * c - (v - CY) * s, CY + (u - CX) * s + (v - CY) * c];
  };
  const turnRing = (ring, a) => {
    const c = Math.cos(a), s = Math.sin(a), R = rot(a);
    return ring.map((q) => { const [u, v] = R(q.u, q.v); return { ...q, u, v, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }; });
  };
  const [br, bi] = rings(CX - 12, CY - 9, CX + 12, CY + 9, 4, 1.4);

  const yaw = spring(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), R = rot(a);
    put(body, prism(P, front, turnRing(br, a), turnRing(bi, a), 2, 13));
    const ft = [[-9, -6], [9, -6], [-9, 6], [9, 6]].map(([u, v]) => R(CX + u, CY + v));
    foot.setAttribute("d", ft.map(([x, y]) => seg(P(x, y, 0), P(x, y, 2))).join(""));
    // the lens: a short barrel out of the face toward the screen
    const ringAtY = (yy) => { const pts = []; for (let i = 0; i < 20; i++) { const t = (i / 20) * Math.PI * 2; const [x, y] = R(CX + 4.2 * Math.cos(t) - 3, yy); pts.push(P(x, y, 7.5 + 4.2 * Math.sin(t))); } return pts; };
    const tip = ringAtY(CY - 15);
    lens.sil.setAttribute("d", poly(hull(tip.concat(ringAtY(CY - 9)))));
    lens.cr.setAttribute("d", poly(tip));
    // the lit frame on the screen face, and the beam to its corners
    const xs = clamp(CX - 3 + D * Math.tan(a), -32 + SW + 2, 32 - SW - 2);
    const fr = [[xs - SW, SZ[0]], [xs + SW, SZ[0]], [xs + SW, SZ[1]], [xs - SW, SZ[1]]].map(([x, z]) => P(x, -30, z));
    spot.setAttribute("d", poly(fr));
    const [lx, ly] = R(CX - 3, CY - 15), L = P(lx, ly, 7.5);
    beam.setAttribute("d", fr.map((q) => seg(L, q)).join(""));
  }

  const B = register(stage, (dt) => { const m = stepS(yaw, dt); draw(Math.round(yaw.x * 100) / 100); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 30);
    if (y < -60 || y > 50 || x < -60 || x > 60) return leave();
    const deg = clamp((Math.atan2(x - CX + 3, D) * 180) / Math.PI, -maxA, maxA);
    yaw.t = deg;
    read.textContent = (deg >= 0 ? "+" : "") + Math.round(deg) + "°";
    B.wake();
  }
  function leave() { yaw.t = REST; read.textContent = "rest"; B.wake(); }
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "projector",
  means: "A projector before its screen: it turns to aim where the pointer is, and the lit frame slides across the screen.",
  rules: [3, 4, 5, 8],
  range: [10, 22, 30],
  tour: [[180, 106], [236, 130], [278, 154], null],
  mount,
});
