/**
 * SIM tray: a phone lying on its back with its SIM tray in the side edge,
 * pulled out a little at rest, bright. The pointer over the phone slides the
 * tray out of the edge to show the card's notched pocket and the pin hole in
 * its end. The slider is how far the tray comes out.
 *
 * The pattern: one part sliding out of a body.
 */
const {
  Cam, fit, hull, poly, prism, proj, rings, rrect, circ, clamp, lerp, tween, tset, tval, tdone, fillet,
  disposer, mk, pointer, put, register, solid, facing, unproj,
} = HL;

const PW = 34, PL = 70, PH = 5.2, XF = PW;
const TY0 = 24, TY1 = 52, TW = 24, TZ = 1.4, TT = 2.4, REST = 5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.7);
  fit(C, [[0, 0, 0], [PW + TW, 0, 0], [0, PL, 0], [PW + TW, PL, 0], [0, 0, PH], [PW, PL, PH]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(0, 0, PW, PL, 7, 1.6);
  put(solid(g), prism(P, front, pr, pi, 0, PH));
  mk("path", { d: poly(rrect(3.5, 3.5, PW - 3.5, PL - 3.5, 5, 6).map((q) => P(q.u, q.v, PH))), class: "nf lo" }, g);
  mk("path", { d: poly(circ(1.3, 12).map((q) => P(PW / 2 + q.u, 7 + q.v, PH))), class: "nf lo" }, g);
  // the slot in the side edge
  mk("path", { d: poly(rrect(TY0 - 0.8, TZ - 0.6, TY1 + 0.8, TZ + TT + 0.6, 1, 3).map((q) => P(XF, q.u, q.v))), class: "nf lo" }, g);

  const tray = solid(g);
  tray.sil.classList.add("hi");
  const pocket = mk("path", { class: "nf lo" }, g), hole = mk("path", { class: "nf lo" }, g);
  const out = tween(REST);
  let last = NaN;
  function draw(o) {
    if (o === last) return;
    last = o;
    const x1 = XF + o, x0 = x1 - TW;
    const fp = fillet([[x0, TY0], [x1, TY0], [x1, TY1], [x0, TY1]], [1, 1.4, 1.4, 1], 3).map(([x, y]) => [Math.max(x, XF), y]);
    const pts = fp.map(([x, y]) => P(x, y, TZ)).concat(fp.map(([x, y]) => P(x, y, TZ + TT)));
    const inner = fp.map(([x, y]) => [x > x1 - 1 ? x1 - 1.2 : x, clamp(y, TY0 + 1.2, TY1 - 1.2)]);
    put(tray, { sil: poly(hull(pts)), crease: poly(inner.map(([x, y]) => P(x, y, TZ + TT))) });
    // the card pocket, notched corner, shown where it has left the slot
    const px0 = x1 - TW + 4, px1 = x1 - 4, py0 = TY0 + 4, py1 = TY1 - 4;
    const pk = [[px0, py0], [px1 - 4, py0], [px1, py0 + 4], [px1, py1], [px0, py1]].map(([x, y]) => [Math.max(x, XF + 0.6), y]);
    pocket.setAttribute("d", px1 > XF + 2 ? poly(pk.map(([x, y]) => P(x, y, TZ + TT))) : "");
    hole.setAttribute("d", poly(circ(0.8, 10).map((q) => P(x1, TY1 - 4 + q.u, TZ + TT / 2 + q.v))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(out, now)); return !tdone(out, now); });
  bag.add(B.unregister);

  let on = null;
  const far = () => lerp(REST + 6, TW - 1, reach);
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(out, v ? far() : REST, performance.now(), 0);
    read.textContent = v ? "tray" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [x, y] = unproj(C, sx, sy, 0);
      setOn(x > -12 && x < PW + TW + 4 && y > -12 && y < PL + 4);
    },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = clamp(v, 0, 1); if (on) { tset(out, far(), performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "simtray",
  means: "A phone with its SIM tray in the side edge: the pointer slides the tray out to show the card pocket and pin hole.",
  rules: [1, 3, 5, 6],
  range: [0.2, 0.8, 1],
  tour: [[213, 170], [231, 229], [170, 175], null],
  mount,
});
