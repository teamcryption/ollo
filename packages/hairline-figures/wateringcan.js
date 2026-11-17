/**
 * Watering can: a can with a long spout and a rose at its tip, standing on
 * the ground. The pointer over the can tips it forward on its front edge to
 * pour, and drops fall from the rose. At rest it stands leaning a little,
 * the rose bright. The slider is how far it tips.
 */
const {
  Cam, fit, facing, hull, poly, proj, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, place, register,
} = HL;

const W = 52, D = 36, H = 50, PX = W, Y0 = D / 2;
const S0 = [W - 4, 10], S1 = [W + 44, 56], RR = 9;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tip = value;
  const C = Cam(45, 0.5, 2.28);
  const tilt = (a) => { const c = Math.cos(a), s = Math.sin(a); return ([x, y, z]) => [PX + (x - PX) * c + z * s, y, -(x - PX) * s + z * c]; };
  const len = Math.hypot(S1[0] - S0[0], S1[1] - S0[1]), dx = (S1[0] - S0[0]) / len, dz = (S1[1] - S0[1]) / len;
  const rose = (off) => Array.from({ length: 24 }, (_, i) => { const t = (i / 24) * 2 * Math.PI; return [S1[0] + dx * off - dz * RR * Math.sin(t), Y0 + RR * Math.cos(t), S1[1] + dz * off + dx * RR * Math.sin(t)]; });
  const ext = [[0, 0, 0], [W, D, 0], [0, D, H + 18], [W, 0, H], [S1[0] + 4, Y0, S1[1] + RR], [S1[0] + 4, Y0, S1[1] - RR]];
  const drops = [[8, -6, -10], [16, 4, -18], [24, -2, -26], [12, 7, -32], [20, -8, -38]];
  const fp = [];
  for (const a of [0.1, 0.75]) { const T = tilt(a); for (const p of ext) fp.push(T(p)); }
  { const tp = tilt(0.75)([S1[0] + dx * 4, Y0, S1[1] + dz * 4]); for (const [ox, oy, oz] of drops) fp.push([tp[0] + ox, tp[1] + oy, tp[2] + oz * 0.8]); }
  fit(C, fp, 200, 168);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const body = mk("path", { class: "sil" }, g), cre = mk("path", { class: "nf lo" }, g), hand = mk("path", {}, g);
  const spout = mk("path", { class: "sil" }, g), rs = mk("path", { class: "sil" }, g), rf = mk("path", { class: "nf lo" }, g);
  const dots = drops.map(() => mk("circle", { class: "dot", r: 0 }, g));
  const foot = rrect(0, 0, W, D, 10, 4), top = rrect(3, 3, W - 3, D - 3, 8, 4);
  const arc = (r) => Array.from({ length: 13 }, (_, i) => { const t = (i / 12) * Math.PI; return [W / 2 - r * Math.cos(t), Y0, H - 4 + r * Math.sin(t) * 0.8]; });
  const circ3 = (cx, cz, r) => Array.from({ length: 16 }, (_, i) => { const t = (i / 16) * 2 * Math.PI; return [cx + r * Math.cos(t), Y0 + r * Math.sin(t), cz]; });
  const tw = tween(0.1);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const T = tilt(a), Q = (p) => P(...T(p));
    body.setAttribute("d", poly(hull(foot.map((q) => Q([q.u, q.v, 0])).concat(foot.map((q) => Q([q.u, q.v, H]))))));
    cre.setAttribute("d", poly(top.map((q) => Q([q.u, q.v, H]))));
    hand.setAttribute("d", poly(arc(22).concat(arc(17).reverse()).map(Q)));
    spout.setAttribute("d", poly(hull(circ3(S0[0], S0[1], 4.5).concat(circ3(S1[0] - dx * 2, S1[1] - dz * 2, 2.6)).map(Q))));
    rs.setAttribute("d", poly(hull(rose(0).concat(rose(4)).map(Q))));
    rf.setAttribute("d", poly(rose(4).map((p) => { const c = [S1[0] + dx * 4, Y0, S1[1] + dz * 4]; return Q([c[0] + (p[0] - c[0]) * 0.7, c[1] + (p[1] - c[1]) * 0.7, c[2] + (p[2] - c[2]) * 0.7]); })));
    const k = Math.max(0, (a - 0.35) / 0.3);
    const tipW = T([S1[0] + dx * 4, Y0, S1[1] + dz * 4]);
    drops.forEach(([ox, oy, oz], i) => { const on = k > i / drops.length; dots[i].setAttribute("r", on ? 1.8 : 0); place(dots[i], P(tipW[0] + ox, tipW[1] + oy, tipW[2] + oz * 0.8)); });
  }

  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  rs.classList.add("hi");

  const mid = P(W / 2 + 20, Y0, H / 2);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? (tip * Math.PI) / 180 : 0.1, performance.now(), 0);
    read.textContent = on ? "pour" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => Math.abs(sx - mid[0]) < 130 && Math.abs(sy - mid[1]) < 100;
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tip = v; if (act) { tset(tw, (v * Math.PI) / 180, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "wateringcan",
  means: "A watering can with a long spout: the pointer tips it forward on its front edge and drops fall from the rose.",
  rules: [1, 3, 5, 6],
  range: [25, 40, 43],
  tour: [[130, 82], [236, 124], [165, 150], null],
  mount,
});
