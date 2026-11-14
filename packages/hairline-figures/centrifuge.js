/**
 * Centrifuge: a squat benchtop body with a round lid hinged at the back,
 * and under it a rotor holding six tubes. The pointer over the body swings
 * the lid open to show the rotor; leaving lets it fall back ajar. At rest
 * the lid is the bright mark; open, the rotor takes it. The slider is how
 * far the lid swings.
 *
 * The pattern: one part opening (tween).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rad, rings, ringAt, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = 24, LR = 24, HY = -LR, AJAR = 14;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-32, -32, 0], [32, 32, 0], [32, -32, 0], [-32, 32, 0], [0, HY, H + 2 * LR + 4], [-24, HY - 6, H + 40]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-32, -32, 32, 32, 13, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  mk("path", { d: poly(ringAt(P, disc(0, 0, LR - 1), H)), class: "nf lo" }, g);
  // the front panel: a recessed strip and a start button on the near face
  mk("path", { d: open([P(32, -14, 7), P(32, 14, 7)]), class: "nf lo" }, g);
  const btn = mk("ellipse", { class: "dot off" }, g);
  const bp = P(32, 20, 13); btn.setAttribute("cx", bp[0]); btn.setAttribute("cy", bp[1]); btn.setAttribute("rx", 2.2); btn.setAttribute("ry", 2.2);
  // the rotor and its six tubes, below the rim
  const rotor = mk("path", { d: poly(ringAt(P, disc(0, 0, 17), H - 2)), class: "sil" }, g);
  for (let i = 0; i < 6; i++) { const t = (i * Math.PI) / 3 + 0.3; mk("path", { d: poly(ringAt(P, disc(11 * Math.cos(t), 11 * Math.sin(t), 2.6, 14), H - 2)), class: "nf lo" }, g); }
  mk("path", { d: poly(ringAt(P, disc(0, 0, 3, 16), H - 2)), class: "nf" }, g);
  const lid = mk("path", { class: "sil" }, g), lidC = mk("path", { class: "nf lo" }, g);

  const tw = tween(AJAR);
  let last = NaN;
  const rot = (ring, z, a) => ring.map((q) => P(q.u, HY + (q.v - HY) * Math.cos(a), z + (q.v - HY) * Math.sin(a)));
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg);
    const outer = disc(0, 0, LR), inner = disc(0, 0, LR - 2.4);
    // thickness grows along the lid's own normal as it swings
    const lo = rot(outer, H, a), hiP = outer.map((q) => P(q.u, HY + (q.v - HY) * Math.cos(a) - 3 * Math.sin(a), H + (q.v - HY) * Math.sin(a) + 3 * Math.cos(a)));
    lid.setAttribute("d", poly(hull(lo.concat(hiP))));
    const ci = inner.map((q) => P(q.u, HY + (q.v - HY) * Math.cos(a) - 3 * Math.sin(a), H + (q.v - HY) * Math.sin(a) + 3 * Math.cos(a)));
    lidC.setAttribute("d", deg < 92 ? poly(ci) : "");
  }

  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  let on = null;
  function setOpen(o) {
    if (o === on) return;
    on = o;
    tset(tw, o ? maxA : AJAR, performance.now(), 0);
    lid.classList.toggle("hi", !o);
    rotor.classList.toggle("hi", o);
    btn.setAttribute("class", o ? "dot m" : "dot off");
    read.textContent = o ? "open " + maxA + "°" : "rest";
    B.wake();
  }
  setOpen(false);
  function hit([sx, sy]) { const [x, y] = unproj(C, sx, sy, H); return Math.abs(x) < 36 && Math.abs(y) < 36; }
  bag.add(pointer(stage, { move: (p) => setOpen(hit(p)), leave: () => setOpen(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (on) { on = null; setOpen(true); } }, destroy: bag.dispose };
}

hairline({
  name: "centrifuge",
  means: "A benchtop centrifuge: the pointer over it swings the lid open on its back hinge to show the rotor and its six tubes.",
  rules: [1, 4, 5, 8],
  range: [60, 100, 110],
  tour: [[200, 184], [200, 243], [200, 126], null],
  mount,
});
