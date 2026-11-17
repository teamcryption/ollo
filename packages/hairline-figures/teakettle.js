/**
 * Iron kettle: a squat cast iron kettle on a trivet, spout to one side, a
 * bail handle on two lugs and a lid with a knob. The pointer over the
 * kettle swings the bail down to the back and tips the lid up off the
 * rim. At rest the lid is bright and the bail stands. The slider is how
 * far the lid opens.
 *
 * The pattern: one part turning on a hinge, another tipping open.
 */
const {
  Cam, circ, fit, hull, poly, proj, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const TZ = 6, RIM = TZ + 28, BW = 17, BH = 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 3.2);
  fit(C, [[-30, -30, 0], [30, 30, 0], [40, 0, TZ + 22], [0, 0, RIM + BH + 2], [-BH - 4, 0, RIM], [-30, 30, 0], [30, -30, 0]], 200, 160);
  const P0 = proj(C), cr = Math.cos(-0.7), sr = Math.sin(-0.7);
  const P = (x, y, z) => P0(x * cr - y * sr, x * sr + y * cr, z);
  const g = mk("g", {}, svg);
  const cyl = (x, y, r, z0, z1) => hull(ringAt(P, disc(x, y, r), z0).concat(ringAt(P, disc(x, y, r), z1)));
  const line = (pts) => "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L");

  // trivet: a ring on three short feet
  for (let k = 0; k < 3; k++) { const a = k * 2.094 + 0.4; mk("path", { d: poly(cyl(24 * Math.cos(a), 24 * Math.sin(a), 2.2, 0, TZ)) }, g); }
  mk("path", { d: poly(cyl(0, 0, 26, TZ - 1.5, TZ)) }, g);
  const back = mk("path", { class: "nf" }, g);
  const spout = [];
  for (const [x, r, z] of [[20, 6, TZ + 10], [30, 4, TZ + 16], [38, 2.6, TZ + 22]]) spout.push(...ringAt(P, disc(x, 0, r, 16), z));
  mk("path", { d: poly(hull(spout)) }, g);
  const body = [];
  for (const [r, z] of [[17, TZ], [24, TZ + 6], [27, TZ + 15], [23, TZ + 25], [15, RIM]]) body.push(...ringAt(P, disc(0, 0, r), z));
  mk("path", { d: poly(hull(body)) }, g);
  for (const s of [-1, 1]) mk("path", { d: poly(cyl(0, s * 15, 2.4, RIM - 3, RIM + 2)) }, g);
  const lid = mk("path", { class: "sil" }, g), knob = mk("path", {}, g);
  const front = mk("path", { class: "nf" }, g);

  const t = tween(0);
  let last = NaN;
  function draw(p) {
    if (p === last) return;
    last = p;
    // the bail turns about the line through its lugs
    const b = -0.25 - 1.25 * p, arc = [];
    for (let i = 0; i <= 24; i++) {
      const a = (i / 24) * Math.PI, up = BH * Math.sin(a);
      arc.push(P(up * Math.sin(b), BW * Math.cos(a), RIM + 1 + up * Math.cos(b)));
    }
    const behind = Math.sin(b) < -0.5;
    back.setAttribute("d", behind ? line(arc) : "");
    front.setAttribute("d", behind ? "" : line(arc));
    // the lid tips up on its far edge, toward the spout
    const tl = 0.95 * p, hx = 13;
    const tip = (u, v, h) => P(hx - (hx - u) * Math.cos(tl) - h * Math.sin(tl), v, RIM + 1 + p * 3 + (hx - u) * Math.sin(tl) + h * Math.cos(tl));
    const lp = [], kp = [];
    for (const q of circ(14, 32)) { lp.push(tip(q.u, q.v, 0), tip(q.u, q.v, 2.5)); }
    for (const q of circ(3.2, 16)) { kp.push(tip(q.u, q.v, 2.5), tip(q.u, q.v, 7)); }
    lid.setAttribute("d", poly(hull(lp)));
    knob.setAttribute("d", poly(hull(kp)));
  }

  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, RIM - 8);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a > 0 ? reach : 0, performance.now(), 0);
    read.textContent = a > 0 ? "open " + Math.round(reach * 100) : "rest";
    B.wake();
  }
  setActive(0);
  lid.classList.add("hi");
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < 110 ? 1 : 0),
    leave: () => setActive(0),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; if (act > 0) { act = -2; setActive(1); } }, destroy: bag.dispose };
}

hairline({
  name: "teakettle",
  means: "A cast iron kettle on a trivet: the pointer swings its bail handle down and tips the lid up off the rim.",
  rules: [1, 3, 5, 6],
  range: [40, 100, 100],
  tour: [[200, 118], [260, 200], [200, 290], null],
  mount,
});
